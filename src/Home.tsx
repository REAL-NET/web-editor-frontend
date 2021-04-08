import React from 'react';

const Home = (props: { name: React.ReactNode; }) => {
    return <h1>Hello {props.name}</h1>
}
export default Home;