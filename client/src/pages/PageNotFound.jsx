import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";


function PageNotFound() {
  return (
    <section className='text-center flex flex-col justify-center items-center h-60'>
      <h1 className='text-6xl font-bold mb-4'>Page Not Found</h1>
      <Link
        to='/'
        className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
      >
        <FaHome/>
      </Link>
    </section>
  );
}

export default PageNotFound