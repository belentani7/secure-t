# Lab guiado: mini-SOC con Wazuh (local)

**Curso:** Ciberseguridad Defensiva: Operar como SOC · **Duración estimada:** 3–4 h · **Nivel:** universitario

## Objetivo

Operate detection: connect 2 agents and detect 3 simulated events.

## Marco legal y ético

Everything runs in your own local VMs; the EICAR file is an inert test pattern.

## Pasos

1. VM 1 (server): Ubuntu Server 22.04 with 4 GB RAM minimum.
2. Install Wazuh following the official quickstart (all-in-one).
3. VM 2 (agent): install the agent, register it with the manager.
4. Generate event 1: 10 failed SSH attempts (`wrong password` in a loop).
5. Generate event 2: create a file with the EICAR string (on Linux: `echo <eicar> > /tmp/test.txt`).
6. Generate event 3: create a user and add it to the sudo group (privilege change).
7. In the Wazuh dashboard: locate the 3 alerts, note level, rule and source.
8. Write the timeline of the 3 events as if it were a real incident.

## Evidencia a entregar

Screenshots of the 3 alerts + timeline (who, what, when, source) in `evidencia-soc.md`.

## Criterio de superación

La evidencia debe permitir que otra persona **reproduzca** el resultado sin preguntarte
nada. Si no es reproducible, no es evidencia (ver [rúbrica](rubrica.md)).
