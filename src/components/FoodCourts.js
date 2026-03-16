import "./FoodCourts.css";
import { Link } from "react-router-dom";

const courts = [
  {
    id: 1,
    name: "Food Court 1",
    location: "North Campus · Campus 1",
    status: "Open",
    icon: "🍛",
  },
  {
    id: 2,
    name: "Food Court 2",
    location: "Tech Block · Campus 2",
    status: "Busy",
    icon: "🍜",
  },
  {
    id: 3,
    name: "Food Court 3",
    location: "Library Annex · Campus 3",
    status: "Open",
    icon: "🥗",
  },
  {
    id: 4,
    name: "Food Court 4",
    location: "Sports Complex · Campus 4",
    status: "Busy",
    icon: "🍕",
  },
  {
    id: 5,
    name: "Food Court 5",
    location: "Hostel Block H5 · Campus 5",
    status: "Closed",
    icon: "☕",
  },
];

function FoodCourts() {
  return (
    <section id="food-courts" className="food-section">
      <div className="container">

        <div className="section-header">
          <h2>
            Choose Your <span>Food Court</span>
          </h2>
          <p>
            Five outlets spread across campus. Pick the one closest to you
            and pre-order in seconds.
          </p>
        </div>

        <div className="food-grid">

          {courts.map((court) => (

            <div className="food-card" key={court.id}>

              <div className="icon-box">
                {court.icon}
              </div>

              <h3>{court.name}</h3>

              <p className="location">
                {court.location}
              </p>

              <div className="card-footer">

                <div className={`status-box ${court.status.toLowerCase()}`}>
                  <span className="status-dot"></span>
                  {court.status}
                </div>

                {court.status === "Closed" ? (
                  <button className="btn-disabled">
                    Unavailable
                  </button>
                ) : (
                  <Link to={`/foodcourt/${court.id}`}>
                    <button className="btn-select">
                      Select
                    </button>
                  </Link>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default FoodCourts;