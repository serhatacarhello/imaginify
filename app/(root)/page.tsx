import { connectToDatabase } from "@/lib/database/mongoose";

const Home = async () => {
  await connectToDatabase();
  console.log("db connected")
  return (
    <div>
      <p>Home</p>

    </div>

  )
}

export default Home
