import doctrotintro from "../../assets/doctor/doctorintro.png";

// About section shown on landing page
const AboutSectionComponent = () => {
  return (
    <section className="w-full bg-[#f3f6f4] py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Image section */}
        <div className="flex justify-center">
          <img
            src={doctrotintro}
            alt="About Medix"
            className="w-[320px] md:w-[380px]"
          />
        </div>

        {/* Text content */}
        <div>
          <h2 className="text-3xl font-bold mb-4">About MEDIX</h2>

          <p className="text-gray-600 leading-7 mb-6">
            It is a long established fact that a reader will be distracted by
            readable content of a page when looking at its layout.
          </p>

          <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
            Discover More
          </button>
        </div>

      </div>
    </section>
  );
};

export default AboutSectionComponent;
