import React, { useState } from 'react'

const SongRealTimeChat = () => {
  const [isOpen, setIsOpen] = useState(true)

  const chatMessages = [
    {
      id: 1,
      sender: "Emre Kaya",
      message: "Bu şarkı gerçekten harika! Çok etkileyici.",
      avatar: "/src/assets/user/Image.png",
      isOwn: false
    },
    {
      id: 2,
      sender: "Sen",
      message: "Kesinlikle katılıyorum, çok güçlü bir şarkı.",
      avatar: "/src/assets/user/Image (1).png",
      isOwn: true
    }
  ]

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`real-time-chat ${isOpen ? 'open' : 'closed'}`}>
      <h3 className="section-title chat-toggle" onClick={toggleChat}>
        Canlı Sohbet
        <span className={`toggle-icon ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? '▼' : '▲'}
        </span>
      </h3>
      
      <div className="chat-content">
        <div className="chat-messages">
          {chatMessages.map((message) => (
            <div key={message.id} className={`chat-message ${message.isOwn ? 'own-message' : 'other-message'}`}>
              <div className="message-avatar">
                <img src={message.avatar} alt={message.sender} />
              </div>
              
              <div className="message-content">
                <div className="message-sender">{message.sender}</div>
                <div className="message-text">{message.message}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-container">
          <div className="chat-input-avatar">
            <img src="/src/assets/user/Image (2).png" alt="Senin avatarın" />
          </div>
          <input 
            type="text" 
            placeholder="Mesajını yaz..."
            className="chat-input"
          />
          <button className="send-button">Gönder</button>
        </div>
      </div>
    </div>
  )
}

export default SongRealTimeChat 