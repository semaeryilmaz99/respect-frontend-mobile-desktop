import React from 'react'
import Header from './Header'
import SongInfo from './SongInfo'
import SongTopSupporters from './SongTopSupporters'
import SongRecentSupporters from './SongRecentSupporters'
import SongRealTimeChat from './SongRealTimeChat'
import MoreByArtist from './MoreByArtist'
import BackButton from './common/BackButton'

const SongPage = () => {
  return (
    <div className="song-page">
      <div className="page-header">
        <BackButton to="/feed" />
      </div>
      <Header />
      <div className="song-content">
        <SongInfo />
        <SongTopSupporters />
        <SongRecentSupporters />
        <SongRealTimeChat />
        <MoreByArtist />
      </div>
    </div>
  )
}

export default SongPage 