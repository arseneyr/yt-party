import React from 'react';
import { Link } from 'react-router'

const Home = () => (
  <div>
    <h1>Home</h1>

    <p>Link to a route using the &lt;Link&gt; component:</p>

    <Link to="/counter">
      Go to Counter
    </Link>
  </div>
);

export default Home;
