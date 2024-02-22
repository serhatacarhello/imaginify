import { UserButton } from '@clerk/nextjs'

const Home = () => {
  return (
    <div>
      <p>hello</p>

      <UserButton afterSignOutUrl='/' />
    </div>

  )
}

export default Home
