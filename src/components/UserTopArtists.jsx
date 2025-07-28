import React from 'react'

const UserTopArtists = () => {
  const topArtists = [
    { id: 1, name: "Arctic Monkeys", respect: "450 Respect", image: "/src/assets/artist/Image.png", isTopRespecter: true },
    { id: 2, name: "Tame Impala", respect: "380 Respect", image: "/src/assets/artist/Image (1).png" },
    { id: 3, name: "The Strokes", respect: "320 Respect", image: "/src/assets/artist/Image (2).png" },
    { id: 4, name: "Mac DeMarco", respect: "280 Respect", image: "/src/assets/artist/Image (3).png" },
    { id: 5, name: "King Krule", respect: "250 Respect", image: "/src/assets/artist/Image (4).png" },
    { id: 6, name: "Radiohead", respect: "220 Respect", image: "/src/assets/artist/Image (5).png" }
  ]

  return (
    <div className="user-top-artists">
      <h3 className="section-title">En Çok Desteklediği Sanatçılar</h3>
      
      <div className="top-artists-grid">
        {topArtists.map((artist) => (
          <div key={artist.id} className={`top-artist-card ${artist.isTopRespecter ? 'top-respecter' : ''}`}>
            {artist.isTopRespecter && (
              <div className="top-respecter-badge">TOP RESPECTER</div>
            )}
            <div className="top-artist-image">
              <img src={artist.image} alt={artist.name} />
            </div>
            <h4 className="top-artist-name">{artist.name}</h4>
            <p className="top-artist-respect">{artist.respect}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserTopArtists 