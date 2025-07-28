import React from 'react'

const UserTopArtists = () => {
  const topArtists = [
    { id: 1, name: "Sezen Aksu", respect: "123 Respect", image: "/src/assets/artist/Image.png" },
    { id: 2, name: "Tarkan", respect: "102 Respect", image: "/src/assets/artist/Image (1).png" },
    { id: 3, name: "Ajda Pekkan", respect: "98 Respect", image: "/src/assets/artist/Image (2).png" },
    { id: 4, name: "Barış Manço", respect: "87 Respect", image: "/src/assets/artist/Image (3).png" }
  ]

  return (
    <div className="user-top-artists">
      <h3 className="section-title">En Çok Respect Gönderdiği Sanatçılar</h3>
      
      <div className="top-artists-grid">
        {topArtists.map((artist) => (
          <div key={artist.id} className="top-artist-card">
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