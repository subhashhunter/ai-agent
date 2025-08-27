import { Link, useNavigate } from "react-router-dom"

export const Navbar=()=>{
    const token=localStorage.getItem("token")
    let user = null;
try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        user = JSON.parse(storedUser);
    }
    } catch (e) {
    console.error('Invalid user in localStorage', e);
    localStorage.removeItem('user'); // clear the bad value
    }
    const navigate=useNavigate()
    const Logout=()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/login")
    }
    return (
        <div className="navbar bg-base-200 ">
        <div className="flex-1">
            <Link to={'/'} className="btn btn-ghost text-xl">
            Ticket AI
            </Link>
        </div>
        <div className="flex gap-2 justify-center">
            {!token ?(
                 <>
            <Link to="/signup" className="btn btn-sm">
              Signup
            </Link>
            <Link to="/login" className="btn btn-sm">
              Login
            </Link>
          </>
            ):(
               <>
               <p className="justify-center "> {user?.email}</p>
               {user && user?.role === "admin" ? (
              <Link to="/admin" className="btn btn-sm">
                Admin
              </Link>
            ) : null}
            <button onClick={Logout} className="btn btn-sm">
              Logout
            </button>
               </>
            )}
        </div>
        </div>
    )

}