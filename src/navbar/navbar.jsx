import { Link } from "react-router-dom";
import Logout from "../pages/logout";
import {getUserFromToken} from "../utitlity/auth"

export default function Navbar() {
    const user = getUserFromToken();
    const name = user.name;
    const role = user.role;
    return(
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between', /* left vs right */
            alignItems: 'center',
            background: '#333',
            color: 'white',
            padding: '5px 10px',
            position: 'sticky', /* or fixed */
            top: 0,
            zIndex: 1000
        }}>
            <div style = {{marginLeft: '15px'}}>
                <h2 style={{display: 'flex',justifyContent: 'space-between', /* left vs right */alignItems: 'center',}}>Workforce</h2>
                {/* <h2 style={{ display: "inline", marginRight: "20px"}}>Job Portal</h2> */}
                <Link to = "/home" style={{ color: "#fff", marginRight: "15px"}}>Home</Link>
                {role==='admin' && <Link to='/company' style={{color: '#fff', marginRight: '15px'}}>Company</Link>}
                {/* <Link to='/skill' style={{color: '#fff', marginRight: '15px'}}>Skill</Link> */}
                {role==='admin' && <Link to='/postJob' style={{color: '#fff', marginRight: '15px'}}>PostJob</Link>}
                <Link to='/applyToJob' style={{color: '#fff', marginRight: '15px'}}>applyToJob</Link>
            </div>
            <h2 style={{padding: "8px 16px", marginLeft: '700px', display: 'flex', justifyContent: 'space-between'}}>Welcome {name}</h2>
            <Logout/>
        </nav>
    );
}