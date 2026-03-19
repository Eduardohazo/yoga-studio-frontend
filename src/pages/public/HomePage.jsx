import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  selectClasses,
  selectClassesLoading,
} from "../../redux/slices/classesSlice";
import { fetchClasses } from "../../redux/slices/classesSlice";

import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const FEATURES = [
  {
    letter: "I",
    title: "Expert Instructors",
    desc: "Certified teachers with years of experience.",
  },
  {
    letter: "S",
    title: "Flexible Schedule",
    desc: "Classes every day from early morning to evening.",
  },
  {
    letter: "A",
    title: "All Levels Welcome",
    desc: "From beginners to advanced practitioners.",
  },
  {
    letter: "H",
    title: "Holistic Approach",
    desc: "Mind, body and spirit in every session.",
  },
];

const HomePage = () => {
  const dispatch = useDispatch();

  const { items: classes, loading } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-accent to-secondary/10 py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Welcome to Your Practice
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6">
            Find Your
            <br />
            Inner Peace
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
            Join our community. Book a class today and start your yoga journey.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/schedule"
              className="btn-primary px-10 py-4 text-base font-semibold"
            >
              Book a Class Now
            </Link>
            <Link
              to="/pricing"
              className="btn-secondary px-10 py-4 text-base font-semibold"
            >
              View Memberships
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            No commitment - Pay per class or get a membership
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-gray-800 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Browse classes",
                desc: "Find the class that fits your level and schedule",
                link: "/classes",
                cta: "See classes",
              },
              {
                step: "2",
                title: "Pick a session",
                desc: "Choose a date and time that works for you",
                link: "/schedule",
                cta: "View schedule",
              },
              {
                step: "3",
                title: "Pay and confirm",
                desc: "Secure checkout via PayPal - you are booked",
                link: "/schedule",
                cta: "Book now",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{s.desc}</p>
                <Link
                  to={s.link}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {s.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {f.letter}
                </div>
                <h3 className="font-serif font-semibold text-gray-800 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Classes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-bold text-gray-800">
              Featured Classes
            </h2>
            <Link
              to="/classes"
              className="text-primary text-sm font-medium hover:underline"
            >
              View all &rarr;
            </Link>
          </div>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.slice(0, 3).map((cls) => (
                <div
                  key={cls._id}
                  className="card hover:shadow-md transition-shadow group flex flex-col"
                >
                  {cls.image && (
                    <div className="h-44 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={cls.image}
                        alt={cls.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg font-semibold text-gray-800 leading-tight">
                      {cls.title}
                    </h3>
                    <span className="text-primary font-bold ml-2 shrink-0">
                      {formatPrice(cls.price)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                    {cls.description}
                  </p>
                  <Link
                    to="/schedule"
                    className="btn-primary text-center w-full text-sm"
                  >
                    Book Now - {formatPrice(cls.price)}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 mb-8">
            Pay per class or save with a membership
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            {[
              {
                label: "Drop-in",
                price: "$18",
                desc: "Single class, any time",
              },
              {
                label: "10 Class Pack",
                price: "$150",
                desc: "Save $30 - Valid 3 months",
                highlight: true,
              },
              {
                label: "Monthly Unlimited",
                price: "$89",
                desc: "Unlimited classes per month",
              },
            ].map((p) => (
              <div
                key={p.label}
                className={
                  "card " + (p.highlight ? "border-2 border-primary" : "")
                }
              >
                {p.highlight && (
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">
                    Best value
                  </p>
                )}
                <p className="font-serif text-lg font-bold text-gray-800">
                  {p.label}
                </p>
                <p className="text-3xl font-bold text-primary my-2">
                  {p.price}
                </p>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/schedule" className="btn-primary px-8 py-3">
              Book a class now
            </Link>
            <Link to="/pricing" className="btn-secondary px-8 py-3">
              See all plans
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Ready to start?
          </h2>
          <p className="mb-8 opacity-80 text-lg">
            Your first class is one click away.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/schedule"
              className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-xl hover:bg-accent transition-colors text-base"
            >
              Book a Class Now
            </Link>
            <Link
              to="/register"
              className="inline-block border-2 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

