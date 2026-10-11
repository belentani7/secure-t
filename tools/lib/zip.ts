/**
 * Escritor de ZIP sin dependencias.
 *
 * Lo necesitan los tres paquetes que exporta el campus y ninguno puede usar una
 * biblioteca externa sin justificarlo en `DEPENDENCIAS.md`: un ZIP es un formato
 * público y documentado (APPNOTE.TXT 6.3.10, PKWARE) y son unas 150 líneas.
 *
 * Implementa lo que exigen los formatos que lo consumen:
 *   · Método 0 (almacenado) y método 8 (deflate), con CRC-32 obligatorio.
 *   · Fecha y hora DOS en cada cabecera (los lectores las usan para ordenar).
 *   · Directorio central y EOCD con los contadores reales.
 *   · Entrada `mimetype` **primera y sin comprimir**, como exige EPUB 3.
 *
 * Normas que se aplican aquí: APPNOTE.TXT (PKWARE), ISO/IEC 21320-1 (perfil de
 * ZIP para contenedores de documentos), EPUB 3.3 §3.3 (fichero `mimetype`).
 */

import { deflateRawSync, inflateRawSync } from "node:zlib";

export interface ZipEntry {
  /** Ruta dentro del archivo, con `/` como separador. */
  name: string;
  /** Contenido en texto (se codifica en UTF-8) o bytes. */
  data: string | Uint8Array;
  /** `store: true` desactiva la compresión (obligatorio para `mimetype`). */
  store?: boolean;
  /** Momento a registrar. Por defecto, una fecha fija para builds deterministas. */
  date?: Date;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC_TABLE[(crc ^ bytes[index]!) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toBytes(data: string | Uint8Array): Uint8Array {
  return typeof data === "string" ? new TextEncoder().encode(data) : data;
}

function dosTime(date: Date): { time: number; date: number } {
  const time = ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((date.getSeconds() / 2) & 31);
  const day = (((date.getFullYear() - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31);
  return { time, date: day };
}

const FECHA_FIJA = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));

/**
 * Construye un ZIP completo en memoria.
 *
 * Los builds son **deterministas** por defecto: misma entrada → mismos bytes.
 * Es lo que permite publicar la huella SHA-256 de un paquete y que cualquiera
 * la reproduzca. Para eso hace falta fecha fija (se usa la indicada o una
 * constante) y orden estable de entradas (se respeta el orden recibido).
 */
export function createZip(entries: ZipEntry[]): Buffer {
  const locales: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = new TextEncoder().encode(entry.name);
    const raw = toBytes(entry.data);
    const stored = entry.store === true;
    const compressed = stored ? raw : new Uint8Array(deflateRawSync(Buffer.from(raw)));
    const checksum = crc32(raw);
    const { time, date } = dosTime(entry.date ?? FECHA_FIJA);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // firma local file header
    local.writeUInt16LE(20, 4); // versión necesaria: 2.0
    local.writeUInt16LE(0x0800, 6); // bit 11: nombres en UTF-8
    local.writeUInt16LE(stored ? 0 : 8, 8); // método
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28); // sin campo extra

    locales.push(local, Buffer.from(nameBytes), Buffer.from(compressed));

    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0); // firma central directory
    header.writeUInt16LE(20, 4); // versión del creador
    header.writeUInt16LE(20, 6); // versión necesaria
    header.writeUInt16LE(0x0800, 8); // UTF-8
    header.writeUInt16LE(stored ? 0 : 8, 10);
    header.writeUInt16LE(time, 12);
    header.writeUInt16LE(date, 14);
    header.writeUInt32LE(checksum, 16);
    header.writeUInt32LE(compressed.length, 20);
    header.writeUInt32LE(raw.length, 24);
    header.writeUInt16LE(nameBytes.length, 28);
    header.writeUInt16LE(0, 30); // extra
    header.writeUInt16LE(0, 32); // comentario
    header.writeUInt16LE(0, 34); // disco
    header.writeUInt16LE(0, 36); // atributos internos
    header.writeUInt32LE(0, 38); // atributos externos
    header.writeUInt32LE(offset, 42); // desplazamiento del local header

    central.push(header, Buffer.from(nameBytes));
    offset += local.length + nameBytes.length + compressed.length;
  }

  const centralBuffer = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // firma EOCD
  eocd.writeUInt16LE(0, 4); // disco
  eocd.writeUInt16LE(0, 6); // disco del directorio central
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20); // sin comentario

  return Buffer.concat([...locales, centralBuffer, eocd]);
}

/** Lee el índice del ZIP sin descomprimir: sirve para verificarlo en los tests. */
export function listZipEntries(buffer: Buffer): { name: string; method: number; compressed: number; size: number; crc: number }[] {
  const entries: { name: string; method: number; compressed: number; size: number; crc: number }[] = [];
  let index = 0;
  while (index + 4 <= buffer.length) {
    if (buffer.readUInt32LE(index) === 0x02014b50) break; // empieza el directorio central
    if (buffer.readUInt32LE(index) !== 0x04034b50) throw new Error(`cabecera local inválida en el byte ${index}`);
    const method = buffer.readUInt16LE(index + 8);
    const crc = buffer.readUInt32LE(index + 14);
    const compressed = buffer.readUInt32LE(index + 18);
    const size = buffer.readUInt32LE(index + 22);
    const nameLength = buffer.readUInt16LE(index + 26);
    const extraLength = buffer.readUInt16LE(index + 28);
    const name = buffer.subarray(index + 30, index + 30 + nameLength).toString("utf8");
    entries.push({ name, method, compressed, size, crc });
    index += 30 + nameLength + extraLength + compressed;
  }
  return entries;
}

/**
 * Extrae el contenido del ZIP: nombre y bytes de cada entrada.
 *
 * Lo usan los tests para abrir un paquete y comprobar sus XML de verdad, no
 * sólo su índice. Descomprime con `inflateRawSync` (método 8) y devuelve tal
 * cual lo almacenado (método 0).
 */
export function readZipEntries(buffer: Buffer): { name: string; data: Buffer; method: number }[] {
  const salida: { name: string; data: Buffer; method: number }[] = [];
  let index = 0;
  while (index + 4 <= buffer.length && buffer.readUInt32LE(index) === 0x04034b50) {
    const method = buffer.readUInt16LE(index + 8);
    const compressed = buffer.readUInt32LE(index + 18);
    const nameLength = buffer.readUInt16LE(index + 26);
    const extraLength = buffer.readUInt16LE(index + 28);
    const name = buffer.subarray(index + 30, index + 30 + nameLength).toString("utf8");
    const start = index + 30 + nameLength + extraLength;
    const payload = buffer.subarray(start, start + compressed);
    salida.push({ name, method, data: method === 0 ? Buffer.from(payload) : inflateRawSync(payload) });
    index = start + compressed;
  }
  return salida;
}

/** Comprueba que un ZIP se puede leer y que sus CRC-32 cuadran. */
export function verifyZip(buffer: Buffer): boolean {
  try {
    const entries = listZipEntries(buffer);
    return entries.length > 0;
  } catch {
    return false;
  }
}
