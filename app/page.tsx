    import Link from "next/link";

    export default function Home() {
      return (
        <div className="container max-w-md px-4 mx-auto py-8">
          <h1 className="text-display">Welcome to FanFlow</h1>
          <p className="text-body">Get paid directly by your fans, seamlessly.</p>
          <p className="text-caption mt-4">Example: View creator profile for FID 1</p>
          <Link href="/1" className="text-primary">Go to Creator Profile</Link>
        </div>
      );
    }
  