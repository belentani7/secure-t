# Secure T — Glassmorphism Messenger Interface

## Design Aesthetic: 'Cristal Sangrante' + Glassmorphism

### Visual Style
- **Background**: Deep dark mode (#0a0a0f) with subtle neon-green accents
- **Glass panels**: Frosted glass effect (ackdrop-filter: blur(20px)) with gba(10,10,15,0.3) backdrop
- **Typography**: System font, monospace for code, geometric sans-serif for UI
- **Accent colors**: Neon red #ff073a for alerts/errors, electric blue #00d4ff for system messages
- **Glassmorphism**: Glass panels with order: 1px solid rgba(255,255,255,0.1) and ox-shadow: 0 4px 20px rgba(0,0,0,0.5)

### Messenger Chat Layout
`
┌─────────────────────────────────────────────┐
│  ╭──────────────────────────────────────╮ │
│ │  Secure T — Chat Universitário         │ │ │
│ │  (glass panel, slightly rounded)       │ │ │
│ │                                        │ │ │
│ │  [Message bubbles]                       │ │ │
│ │  • User: "Olá, preciso de ajuda..."     │ │ │
│ │  • System: "Como posso auxiliar?"       │ │ │
│ │  • User: "Status do laboratório..."     │ │ │ │
│ │                                        │ │ │
│ │  [Input field at bottom]                │ │ │
│ │  └─ Digite sua mensagem... (Enter)     │ │ │
│ ╰──────────────────────────────────────────╯ │
└─────────────────────────────────────────────┘
`

### Message Bubble Styles
`css
/* User message bubble */
.user-bubble {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  margin: 8px 0;
  max-width: 80%;
  float: right;
  font-size: 14px;
}

/* System message bubble */
.system-bubble {
  background: rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: #e0ffff;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  margin: 8px 0;
  max-width: 80%;
  float: left;
  font-size: 14px;
  font-style: italic;
}

/* Input field */
.input-field {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 14px;
  border-radius: 20px;
  width: 80%;
  font-size: 14px;
  margin: 12px 0 0 0;
}
`

### Glass Panel Component
`jsx
// GlassChatPanel.jsx
import React from 'react';

const GlassChatPanel = ({ messages, onSend }) => {
  return (
    <div className="glass-panel" style={{
      padding: '20px',
      maxHeight: '70vh',
      overflowY: 'auto',
      gap: '12px'
    }}>
      {messages.map((msg, index) => (
        <div key={index} style={{
          ...(msg.type === 'user' ? userBubbleStyle : systemBubbleStyle),
          float: msg.type === 'user' ? 'right' : 'left'
        }}>
          {msg.content}
        </div>
      ))}
      <div style={inputStyle}>
        <input 
          type="text" 
          placeholder="Digite sua mensagem..."
          onKeyPress={e => e.key === 'Enter' && onSend(e.target.value)}
          value={inputValue}
        />
      </div>
    </div>
  );
};
