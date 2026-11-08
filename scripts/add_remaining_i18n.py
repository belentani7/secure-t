#!/usr/bin/env python3
"""
Add all remaining hardcoded string keys to locale files.
Run from repo root: python scripts/add_remaining_i18n.py
"""

import json
from pathlib import Path

LOCALES_DIR = Path(__file__).resolve().parents[1] / "client" / "src" / "locales"
LANGS = ["en", "es", "ca", "fr", "it", "pt", "de", "nl", "ja"]

REMAINING_KEYS = {
    # --- Mentor.tsx ---
    "mentor.title_main": {
        "en": "Astra, your Mentor",
        "es": "Astra, tu Mentor",
        "ca": "Astra, el teu Mentor",
        "fr": "Astra, votre Mentor",
        "it": "Astra, il tuo Mentor",
        "pt": "Astra, seu Mentor",
        "de": "Astra, dein Mentor",
        "nl": "Astra, jouw Mentor",
        "ja": "アストラ、あなたのメンター",
    },
    "mentor.skip_content": {
        "en": "Skip to content",
        "es": "Saltar al contenido",
        "ca": "Saltar al contingut",
        "fr": "Aller au contenu",
        "it": "Vai al contenuto",
        "pt": "Pular para o conteúdo",
        "de": "Zum Inhalt springen",
        "nl": "Naar inhoud springen",
        "ja": "コンテンツにスキップ",
    },
    "mentor.suggestion_1": {
        "en": "Explain the difference between threat, vulnerability and risk with an example.",
        "es": "Explícame la diferencia entre amenaza, vulnerabilidad y riesgo con un ejemplo.",
        "ca": "Expliqua'm la diferència entre amenaça, vulnerabilitat i risc amb un exemple.",
        "fr": "Expliquez la différence entre menace, vulnérabilité et risque avec un exemple.",
        "it": "Spiegami la differenza tra minaccia, vulnerabilità e rischio con un esempio.",
        "pt": "Explique a diferença entre ameaça, vulnerabilidade e risco com um exemplo.",
        "de": "Erkläre den Unterschied zwischen Bedrohung, Schwachstelle und Risiko anhand eines Beispiels.",
        "nl": "Leg het verschil tussen bedreiging, kwetsbaarheid en risico uit met een voorbeeld.",
        "ja": "脅威、脆弱性、リスクの違いを例を挙げて説明してください。",
    },
    "mentor.suggestion_2": {
        "en": "How do I start a threat model of an API without inventing attacks?",
        "es": "¿Cómo empiezo un threat model de una API sin inventar ataques?",
        "ca": "Com començo un threat model d'una API sense inventar atacs?",
        "fr": "Comment démarrer un threat model d'API sans inventer d'attaques ?",
        "it": "Come faccio a iniziare un threat model di un'API senza inventare attacchi?",
        "pt": "Como começo um threat model de uma API sem inventar ataques?",
        "de": "Wie starte ich ein Threat Model einer API, ohne Angriffe zu erfinden?",
        "nl": "Hoe begin ik een threat model van een API zonder aanvallen te bedenken?",
        "ja": "APIの脅威モデルを攻撃をでっち上げずに始めるには？",
    },
    "mentor.suggestion_3": {
        "en": "Give me a 20-minute plan to triage a PowerShell alert.",
        "es": "Dame un plan de 20 minutos para triagear una alerta de PowerShell.",
        "ca": "Dóna'm un pla de 20 minuts per triar una alerta de PowerShell.",
        "fr": "Donnez-moi un plan de 20 minutes pour trier une alerte PowerShell.",
        "it": "Dammi un piano di 20 minuti per fare il triage di un avviso PowerShell.",
        "pt": "Me dê um plano de 20 minutos para triar um alerta PowerShell.",
        "de": "Gib mir einen 20-Minuten-Plan, um einen PowerShell-Alert zu triagieren.",
        "nl": "Geef me een 20-minutenplan om een PowerShell-waarschuwing te triageren.",
        "ja": "PowerShellアラートをトリアージするための20分プランをください。",
    },
    "mentor.suggestion_4": {
        "en": "What evidence do I need to defend a control before an auditor?",
        "es": "¿Qué evidencia necesito para defender un control ante un auditor?",
        "ca": "Quina evidència necessito per defensar un control davant un auditor?",
        "fr": "Quelles preuves me faut-il pour défendre un contrôle face à un auditeur ?",
        "it": "Quali prove mi servono per difendere un controllo davanti a un revisore?",
        "pt": "Que evidência preciso para defender um controle diante de um auditor?",
        "de": "Welche Beweise brauche ich, um eine Kontrolle vor einem Auditor zu verteidigen?",
        "nl": "Welk bewijs heb ik nodig om een controle te verdedigen voor een auditor?",
        "ja": "監査人の前でコントロールを守るために何の証拠が必要ですか？",
    },

    # --- NotFound.tsx ---
    "notfound.title": {
        "en": "Page Not Found",
        "es": "Página no encontrada",
        "ca": "Pàgina no trobada",
        "fr": "Page introuvable",
        "it": "Pagina non trovata",
        "pt": "Página não encontrada",
        "de": "Seite nicht gefunden",
        "nl": "Pagina niet gevonden",
        "ja": "ページが見つかりません",
    },
    "notfound.subtitle": {
        "en": "Sorry, the page you are looking for doesn't exist.",
        "es": "Lo sentimos, la página que buscas no existe.",
        "ca": "Ho sentim, la pàgina que busques no existeix.",
        "fr": "Désolé, la page que vous cherchez n'existe pas.",
        "it": "Spiacenti, la pagina che cerchi non esiste.",
        "pt": "Desculpe, a página que você procura não existe.",
        "de": "Entschuldigung, die gesuchte Seite existiert nicht.",
        "nl": "Sorry, de pagina die u zoekt bestaat niet.",
        "ja": "お探しのページは存在しません。",
    },
    "notfound.detail": {
        "en": "It may have been moved or deleted.",
        "es": "Puede que haya sido movida o eliminada.",
        "ca": "Potser ha estat moguda o eliminada.",
        "fr": "Elle a peut-être été déplacée ou supprimée.",
        "it": "Potrebbe essere stata spostata o eliminata.",
        "pt": "Pode ter sido movida ou excluída.",
        "de": "Sie wurde möglicherweise verschoben oder gelöscht.",
        "nl": "Het is mogelijk verplaatst of verwijderd.",
        "ja": "移動または削除された可能性があります。",
    },
    "notfound.go_home": {
        "en": "Go Home",
        "es": "Ir al inicio",
        "ca": "Anar a l'inici",
        "fr": "Retour à l'accueil",
        "it": "Torna alla home",
        "pt": "Voltar ao início",
        "de": "Zur Startseite",
        "nl": "Naar startpagina",
        "ja": "ホームに戻る",
    },

    # --- App.tsx ---
    "loading": {
        "en": "Loading secure T…",
        "es": "Cargando secure T…",
        "ca": "Carregant secure T…",
        "fr": "Chargement de secure T…",
        "it": "Caricamento di secure T…",
        "pt": "Carregando secure T…",
        "de": "secure T wird geladen…",
        "nl": "secure T laden…",
        "ja": "secure Tを読み込み中…",
    },
    "skip.content": {
        "en": "Skip to content",
        "es": "Saltar al contenido",
        "ca": "Saltar al contingut",
        "fr": "Aller au contenu",
        "it": "Vai al contenuto",
        "pt": "Pular para o conteúdo",
        "de": "Zum Inhalt springen",
        "nl": "Naar inhoud springen",
        "ja": "コンテンツにスキップ",
    },

    # --- ManusDialog.tsx ---
    "manus.dialog_alt": {
        "en": "Dialog graphic",
        "es": "Gráfico del diálogo",
        "ca": "Gràfic del diàleg",
        "fr": "Graphique de la boîte de dialogue",
        "it": "Grafica della finestra di dialogo",
        "pt": "Gráfico do diálogo",
        "de": "Dialoggrafik",
        "nl": "Dialoogafbeelding",
        "ja": "ダイアログのグラフィック",
    },
    "manus.login_prompt": {
        "en": "Please login with Manus to continue",
        "es": "Inicie sesión con Manus para continuar",
        "ca": "Inicieu la sessió amb Manus per continuar",
        "fr": "Connectez-vous avec Manus pour continuer",
        "it": "Accedi con Manus per continuare",
        "pt": "Faça login com Manus para continuar",
        "de": "Melden Sie sich mit Manus an, um fortzufahren",
        "nl": "Log in met Manus om door te gaan",
        "ja": "Manusでログインして続行してください",
    },
    "manus.login_button": {
        "en": "Login with Manus",
        "es": "Iniciar sesión con Manus",
        "ca": "Iniciar sessió amb Manus",
        "fr": "Connexion avec Manus",
        "it": "Accedi con Manus",
        "pt": "Login com Manus",
        "de": "Anmeldung mit Manus",
        "nl": "Inloggen met Manus",
        "ja": "Manusでログイン",
    },

    # --- NotificationCenter.tsx ---
    "notifications.title": {
        "en": "Task Notifications",
        "es": "Notificaciones de tareas",
        "ca": "Notificacions de tasques",
        "fr": "Notifications de tâches",
        "it": "Notifiche attività",
        "pt": "Notificações de tarefas",
        "de": "Aufgaben-Benachrichtigungen",
        "nl": "Taakmeldingen",
        "ja": "タスク通知",
    },
    "notifications.subtitle": {
        "en": "Receive a browser alert and sound when a task (lab, assessment, assistant) finishes.",
        "es": "Recibe un aviso del navegador y un sonido cuando una tarea (laboratorio, evaluación, asistente) termina.",
        "ca": "Rep un avís del navegador i un so quan una tasca (laboratori, avaluació, assistent) finalitza.",
        "fr": "Recevez une alerte du navigateur et un son quand une tâche (labo, évaluation, assistant) se termine.",
        "it": "Ricevi un avviso del browser e un suono quando un'attività (lab, valutazione, assistente) finisce.",
        "pt": "Receba um aviso do navegador e um som quando uma tarefa (laboratório, avaliação, assistente) termina.",
        "de": "Erhalten Sie einen Browser-Hinweis und einen Ton, wenn eine Aufgabe (Labor, Bewertung, Assistent) abgeschlossen ist.",
        "nl": "Ontvang een browserbericht en een geluid wanneer een taak (labo, evaluatie, assistent) eindigt.",
        "ja": "タスク（ラボ、評価、アシスタント）が終了したときにブラウザ通知と音を受け取ります。",
    },
    "notifications.enable_label": {
        "en": "Enable notifications",
        "es": "Activar avisos",
        "ca": "Activar avisos",
        "fr": "Activer les notifications",
        "it": "Attiva notifiche",
        "pt": "Ativar avisos",
        "de": "Benachrichtigungen aktivieren",
        "nl": "Meldingen activeren",
        "ja": "通知を有効にする",
    },
    "notifications.sound_label": {
        "en": "Sound",
        "es": "Sonido",
        "ca": "So",
        "fr": "Son",
        "it": "Suono",
        "pt": "Som",
        "de": "Ton",
        "nl": "Geluid",
        "ja": "音",
    },
    "notifications.volume_label": {
        "en": "Volume",
        "es": "Volumen",
        "ca": "Volum",
        "fr": "Volume",
        "it": "Volume",
        "pt": "Volume",
        "de": "Lautstärke",
        "nl": "Volume",
        "ja": "音量",
    },
    "notifications.failures_label": {
        "en": "Also notify on failures",
        "es": "Avisar también de fallos",
        "ca": "Avisar també d'errors",
        "fr": "Notifier aussi les échecs",
        "it": "Notifica anche i fallimenti",
        "pt": "Avisar também de falhas",
        "de": "Auch bei Fehlern benachrichtigen",
        "nl": "Ook bij fouten melden",
        "ja": "失敗時も通知する",
    },
    "notifications.failures_desc": {
        "en": "Failed or cancelled tasks.",
        "es": "Tareas fallidas o canceladas.",
        "ca": "Tasques fallades o cancel·lades.",
        "fr": "Tâches échouées ou annulées.",
        "it": "Attività fallite o annullate.",
        "pt": "Tarefas falhadas ou canceladas.",
        "de": "Fehlgeschlagene oder abgebrochene Aufgaben.",
        "nl": "Mislukte of geannuleerde taken.",
        "ja": "失敗またはキャンセルされたタスク。",
    },
    "notifications.authorize_button": {
        "en": "Authorize notifications",
        "es": "Autorizar notificaciones",
        "ca": "Autoritzar notificacions",
        "fr": "Autoriser les notifications",
        "it": "Autorizza notifiche",
        "pt": "Autorizar notificações",
        "de": "Benachrichtigungen autorisieren",
        "nl": "Meldingen autoriseren",
        "ja": "通知を許可する",
    },
    "notifications.test_button": {
        "en": "Test",
        "es": "Probar",
        "ca": "Provar",
        "fr": "Tester",
        "it": "Prova",
        "pt": "Testar",
        "de": "Testen",
        "nl": "Testen",
        "ja": "テスト",
    },

    # Permission copy
    "notifications.perm_unsupported": {
        "en": "This browser does not support desktop notifications.",
        "es": "Este navegador no admite notificaciones de escritorio.",
        "ca": "Aquest navegador no admet notificacions d'escriptori.",
        "fr": "Ce navigateur ne prend pas en charge les notifications de bureau.",
        "it": "Questo browser non supporta le notifiche desktop.",
        "pt": "Este navegador não suporta notificações de desktop.",
        "de": "Dieser Browser unterstützt keine Desktop-Benachrichtigungen.",
        "nl": "Deze browser ondersteunt geen desktopmeldingen.",
        "ja": "このブラウザはデスクトップ通知をサポートしていません。",
    },
    "notifications.perm_default": {
        "en": "Allow notifications to receive system alerts.",
        "es": "Autoriza las notificaciones para recibir avisos del sistema.",
        "ca": "Autoritza les notificacions per rebre avisos del sistema.",
        "fr": "Autorisez les notifications pour recevoir des alertes système.",
        "it": "Autorizza le notifiche per ricevere avvisi di sistema.",
        "pt": "Autorize as notificações para receber avisos do sistema.",
        "de": "Erlauben Sie Benachrichtigungen, um Systemwarnungen zu erhalten.",
        "nl": "Sta meldingen toe om systeemmeldingen te ontvangen.",
        "ja": "システムアラートを受け取るには通知を許可してください。",
    },
    "notifications.perm_granted": {
        "en": "Notifications allowed.",
        "es": "Notificaciones autorizadas.",
        "ca": "Notificacions autoritzades.",
        "fr": "Notifications autorisées.",
        "it": "Notifiche autorizzate.",
        "pt": "Notificações autorizadas.",
        "de": "Benachrichtigungen erlaubt.",
        "nl": "Meldingen toegestaan.",
        "ja": "通知が許可されました。",
    },
    "notifications.perm_denied": {
        "en": "Notifications blocked in browser settings.",
        "es": "Notificaciones bloqueadas en los ajustes del navegador.",
        "ca": "Notificacions bloquejades a la configuració del navegador.",
        "fr": "Notifications bloquées dans les paramètres du navigateur.",
        "it": "Notifiche bloccate nelle impostazioni del browser.",
        "pt": "Notificações bloqueadas nas configurações do navegador.",
        "de": "Benachrichtigungen in den Browsereinstellungen blockiert.",
        "nl": "Meldingen geblokkeerd in browserinstellingen.",
        "ja": "ブラウザの設定で通知がブロックされています。",
    },
}


def load_locale(lang: str) -> dict:
    path = LOCALES_DIR / f"{lang}.json"
    return json.loads(path.read_text(encoding="utf-8"))


def save_locale(lang: str, data: dict):
    path = LOCALES_DIR / f"{lang}.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    print("Adding remaining i18n keys to all 9 locales...")
    for lang in LANGS:
        locale = load_locale(lang)
        added = 0
        for key, translations in REMAINING_KEYS.items():
            if key not in locale:
                locale[key] = translations[lang]
                added += 1
        if added:
            save_locale(lang, locale)
            print(f"  {lang}.json: +{added} keys")
        else:
            print(f"  {lang}.json: already up to date")
    print("Done!")


if __name__ == "__main__":
    main()