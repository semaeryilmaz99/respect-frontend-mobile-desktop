import React from 'react'

const UserTopSongs = () => {
  const topSongs = [
    { id: 1, title: "Gidiyorum", respect: "87 Respect", cover: "/src/assets/song/Image.png" },
    { id: 2, title: "Şarkı Söyleyemem", respect: "75 Respect", cover: "/src/assets/song/Image (1).png" },
    { id: 3, title: "Kaybolan Yıllar", respect: "63 Respect", cover: "/src/assets/song/Image (2).png" }
  ]

  return (
    <div className="user-top-songs">
      <h3 className="section-title">En Çok Respect Gönderdiği Şarkılar</h3>
      
      <div className="top-songs-grid">
        {topSongs.map((song) => (
          <div key={song.id} className="top-song-card">
            <div className="top-song-cover">
              <img src={song.cover} alt={`${song.title} kapağı`} />
            </div>
            <h4 className="top-song-title">{song.title}</h4>
            <p className="top-song-respect">{song.respect}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserTopSongs 