import React from 'react'

const UserTopSongs = () => {
  const topSongs = [
    { id: 1, title: "Do I Wanna Know?", artist: "Arctic Monkeys", respect: "85 Respect", cover: "/src/assets/song/Image.png" },
    { id: 2, title: "The Less I Know The Better", artist: "Tame Impala", respect: "72 Respect", cover: "/src/assets/song/Image (1).png" },
    { id: 3, title: "Last Nite", artist: "The Strokes", respect: "68 Respect", cover: "/src/assets/song/Image (2).png" },
    { id: 4, title: "Chamber of Reflection", artist: "Mac DeMarco", respect: "55 Respect", cover: "/src/assets/song/Image (3).png" },
    { id: 5, title: "Easy Easy", artist: "King Krule", respect: "42 Respect", cover: "/src/assets/song/Image (4).png" }
  ]

  return (
    <div className="user-top-songs">
      <h3 className="section-title">En Çok Desteklediği Şarkılar</h3>
      
      <div className="top-songs-grid">
        {topSongs.map((song) => (
          <div key={song.id} className="top-song-card">
            <div className="top-song-cover">
              <img src={song.cover} alt={`${song.title} kapağı`} />
            </div>
            <h4 className="top-song-title">{song.title}</h4>
            <p className="top-song-artist">{song.artist}</p>
            <p className="top-song-respect">{song.respect}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserTopSongs 