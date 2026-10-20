import { Link,  } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">

    <Navbar/>
      <section id="home" className="px-4 pt-5 sm:px-6 lg:px-8">
        <div
          className="relative mx-auto flex min-h-[530px] max-w-7xl items-center overflow-hidden rounded-[28px] bg-cover bg-center sm:min-h-[600px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,35,29,0.90), rgba(8,35,29,0.30)), url('/bgimg.avif')",
          }}
        >
          <div className="max-w-3xl px-6 py-16 sm:px-12 lg:px-16">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-white backdrop-blur">
              DISCOVER YOUR NEXT ADVENTURE
            </span>

            <h2 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              The world is vast.
              <br />
              Your journey is
              <br />
              <span className="font-serif italic text-emerald-300">
                uniquely yours.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-200 sm:text-base sm:leading-8">
              Discover destinations that match your interests, explore
              experiences shared by fellow travellers, and find places
              you'll love through personalized recommendations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-xl bg-emerald-500 px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                Start your journey →
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-center text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Login to explore
              </Link>
            </div>

            <div className="mt-12 border-t border-white/20 pt-6">
              <p className="max-w-lg text-sm leading-6 text-gray-200">
                Your preferences. Real traveller experiences. More meaningful
                travel discoveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section id="about" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-700">
              About WanderWise
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              Travel discovery,
              <br />
              made personal.
            </h2>

            <p className="mt-6 text-sm leading-8 text-gray-600 sm:text-base">
              Choosing a destination shouldn't mean browsing endless lists
              of places. WanderWise helps travellers discover destinations
              using their preferred travel categories and review history.
            </p>

            <p className="mt-4 text-sm leading-8 text-gray-600 sm:text-base">
              By combining destination information with community ratings
              and traveller preferences, our system makes travel discovery
              more relevant and transparent.
            </p>

            <Link
              to="/signup"
              className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900"
            >
              Find your next destination <span>→</span>
            </Link>
          </div>

          <div className="relative">
            <img
              src="/bgimg2.avif"
              alt="Beautiful mountain landscape"
              loading="lazy"
              className="h-80 w-full rounded-3xl object-cover shadow-xl sm:h-[420px]"
            />

            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl bg-white p-5 shadow-xl sm:left-8 sm:right-8">
              <p className="text-sm font-bold text-emerald-800">
                Your journey, your preferences.
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Recommendations informed by your interests and experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-700">
              What makes us different
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Everything for better discovery
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Explore travel possibilities with tools designed around your
              interests and experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "/recommend.png",
                title: "Personalized Recommendations",
                description:
                  "Discover places based on your preferred categories and review history.",
              },
              {
                icon:"/destination.png",
                title: "Destination Discovery",
                description:
                  "Explore destination information, categories, locations, and descriptions.",
              },
              {
                icon:"/five-stars.png",
                title: "Traveller Reviews",
                description:
                  "Read community ratings and share your own travel experiences.",
              },
              {
                icon: "/preferences.png",
                title: "Your Travel Preferences",
                description:
                  "Choose the kinds of destinations and experiences that interest you.",
              },
              {
                icon:"/advice.png",
                title: "Transparent Suggestions",
                description:
                  "Understand how your preferences and ratings influence recommendations.",
              },
              {
                icon: "/account.png",
                title: "Secure Accounts",
                description:
                  "Access account features through authenticated user sessions.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-[#E8F0E8] p-7 transition hover:-translate-y-1 hover:shadow-lg "
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl ">
                  <img src={feature.icon} className=" h-10 w-10 object-contain"/>
                </div>

                <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-emerald-900 px-6 py-14 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-300">
            Your next adventure awaits
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white sm:text-5xl">
            Ready to discover a place that feels like you?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-emerald-100">
            Create your account, tell us what you love, and start discovering
            destinations selected around your interests.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-4 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
          >
            Create your account →
          </Link>
        </div>
      </section>

      
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          <div>
            <Link to="/" className="text-xl font-extrabold">
              Wander<span className="text-emerald-400">Wise</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              A tourism recommendation system for discovering destinations
              based on traveller interests and community experiences.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>

            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-gray-400">
              <a href="#about" className="hover:text-white">
                About
              </a>
              <a href="#features" className="hover:text-white">
                Features
              </a>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="hover:text-white">
                Signup
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Begin exploring</h3>

            <p className="mt-4 text-sm leading-7 text-gray-400">
              Sign up to save your preferences and receive personalized
              destination recommendations.
            </p>

            <Link
              to="/signup"
              className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold hover:bg-emerald-500"
            >
              Get Started →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} WanderWise | Tourism Recommendation
          System
        </div>
      </footer>
    </div>
  );
}

export default Home;