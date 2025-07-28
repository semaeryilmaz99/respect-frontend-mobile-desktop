import React from 'react'

const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="user-profile-image">
        <img src="/src/assets/user/Image.png" alt="Emre Demir" />
      </div>
      
      <div className="user-info">
        <h2 className="user-name">Emre Demir</h2>
        <p className="user-handle">@emre_demir</p>
        
        <p className="user-bio">
          İstanbul'dan şarkıcı-besteci. Ruha dokunan müzikler yaratma konusunda tutkulu.
        </p>
      </div>
    </div>
  )
}

export default UserProfile 