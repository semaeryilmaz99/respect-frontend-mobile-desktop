import React, { useState, useEffect } from 'react'
import { chatManager } from '../utils/realtimeChat'
import { supabase } from '../config/supabase'

const RealTimeChat = ({ roomId = 'general', roomType = 'artist' }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  // Chat room'a join ol ve mesajları yükle
  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true)
        
        // Current user'ı al
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        // Mevcut mesajları yükle
        const { data: existingMessages, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles(username, full_name, avatar_url)
          `)
          .eq('room_id', roomId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('❌ Load messages error:', error)
        } else {
          console.log('✅ Chat messages loaded:', existingMessages)
          setMessages(existingMessages || [])
        }

        // Real-time chat'e join ol
        chatManager.joinChatRoom(roomId, roomType, (newMessage) => {
          console.log('💬 New message received in component:', newMessage)
          console.log('💬 Current messages:', messages)
          setMessages(prev => {
            console.log('💬 Updating messages from:', prev, 'to:', [...prev, newMessage])
            return [...prev, newMessage]
          })
        })

      } catch (error) {
        console.error('❌ Chat load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChat()

    // Cleanup
    return () => {
      chatManager.leaveChatRoom(roomId)
    }
  }, [roomId, roomType])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return

    try {
      console.log('📤 Sending message:', newMessage)
      
      await chatManager.sendMessage(roomId, roomType, newMessage.trim())
      setNewMessage('')
      
      // Manuel olarak mesajları yenile (real-time çalışmazsa)
      setTimeout(async () => {
        const { data: updatedMessages, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles(username, full_name, avatar_url)
          `)
          .eq('room_id', roomId)
          .order('created_at', { ascending: true })

        if (!error && updatedMessages) {
          console.log('🔄 Manually refreshed messages:', updatedMessages)
          setMessages(updatedMessages)
        }
      }, 500) // 500ms bekle
      
    } catch (error) {
      console.error('❌ Send message error:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
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
        {loading ? (
          <div className="chat-loading">
            <p>Mesajlar yükleniyor...</p>
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {messages.map((message) => {
                const isOwn = currentUser?.id === message.user_id
                const senderName = message.profiles?.full_name || message.profiles?.username || 'Anonim'
                const avatar = message.profiles?.avatar_url || '/src/assets/user/Image.png'
                
                return (
                  <div key={message.id} className={`chat-message ${isOwn ? 'own-message' : 'other-message'}`}>
                    <div className="message-avatar">
                      <img src={avatar} alt={senderName} />
                    </div>
                    
                    <div className="message-content">
                      <div className="message-sender">{senderName}</div>
                      <div className="message-text">{message.message}</div>
                      <div className="message-time">
                        {new Date(message.created_at).toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="chat-input-container">
              <div className="chat-input-avatar">
                <img 
                  src={currentUser?.user_metadata?.avatar_url || '/src/assets/user/Image.png'} 
                  alt="Senin avatarın" 
                />
              </div>
              <input 
                type="text" 
                placeholder="Mesajını yaz..."
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!currentUser}
              />
              <button 
                className="send-button"
                onClick={sendMessage}
                disabled={!newMessage.trim() || !currentUser}
              >
                Gönder
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RealTimeChat 