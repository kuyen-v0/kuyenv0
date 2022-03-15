import BigButton from "./BigButton";

export default function Navbar({ bg }) {
  return (
    <nav className={"navbar-expand-lg relative flex w-full flex-wrap items-center justify-between " + (bg ?? "")}>
      <div className="container-fluid flex w-full flex-wrap items-center justify-between px-6">
        <div
          className="collapse navbar-collapse flex-grow place-content-between items-center"
          id="navbarSupportedContent1"
        >
          <div>
            <a className="pr-2 text-xl font-semibold text-white" href="/">
              <img
                className="logo-fyat"
                src="https://pbs.twimg.com/profile_images/1469164041558007808/FRqpXQX5_400x400.jpg"
              ></img>
            </a>
          </div>
          <div>
            <ul className="navbar-nav list-style-none mr-auto flex flex-col pl-0">
              <li className="nav-item p-2">
                <a
                  className="nav-link text-white"
                  href="https://discord.gg/fyatlux"
                >
                  <BigButton text='Join Our Discord' />
                </a>
              </li>
              <li className="nav-item p-2">
                <a className="nav-link p-0 text-white" href="my-assets">
                  <BigButton text='My Collection' bg='bg-yellow-400' textColor={'text-black'} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="dropdown relative">
            <a
              className="dropdown-toggle hidden-arrow flex items-center"
              href="/"
              id="dropdownMenuButton2"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></a>
            <ul
              className="dropdown-menu absolute left-auto right-0 z-50 float-left m-0 mt-1 hidden hidden min-w-max list-none rounded-lg border-none bg-white bg-clip-padding py-2 text-left text-base shadow-lg"
              aria-labelledby="dropdownMenuButton2"
            ></ul>
          </div>
        </div>
      </div>
    </nav>
  );
}