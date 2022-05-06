import React from 'react';
import { Player } from '../components/Player';
import { Connect } from '../components/Connect';
import { Loader } from '../components/Loader';
import { Auth, AuthContext } from '../components/Auth';

function HomePage() {
  return (
    <Auth>
      <AuthContext.Consumer>
        {(token) => {
          if (!token) {
            return <Loader />;
          }

          return (
            <Player token={token}>
              <Connect />
            </Player>
          );
        }}
      </AuthContext.Consumer>
    </Auth>
  );
}

export default HomePage;
