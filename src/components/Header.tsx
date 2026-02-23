import { Link } from 'react-router-dom';

import logo from '../assets/logo.svg';

const Header = () => {
  return (
    <>
        <Link to='/'>
            <img src={logo} alt="metro logo" className="logo"/>
        </Link>
    </>
  );
};

export default Header;