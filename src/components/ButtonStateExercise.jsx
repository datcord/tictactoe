import { useState } from "react";

const dependencies = {
  BOLTS: ["FRAME"],
  SHEETS: ["BEAMS"],
};

const initialStatus = {
  SHEETS: true,
  BEAMS: true,
  BOLTS: true,
  FRAME: true,
};

function FactoryStatus() {
  const [status, setStatus] = useState(initialStatus);

  const handleToggle = (station) => {
    const newStatus = { ...status, [station]: !status[station] };
    updateDependentStations(station, newStatus[station], newStatus);
    setStatus(newStatus);
  };

  const updateDependentStations = (station, isInOrder, newStatus) => {
    if (dependencies[station]) {
      dependencies[station].forEach((dependentStation) => {
        newStatus[dependentStation] = isInOrder;
        if (!isInOrder) {
          updateDependentStations(dependentStation, isInOrder, newStatus);
        }
      });
    }
  };

  return (
    <div>
      <h3>Control Panel</h3>
      <div>
        <input
          type="checkbox"
          id="sheets-status"
          checked={status.SHEETS}
          onChange={() => handleToggle("SHEETS")}
        />
        <span
          id="sheets-station"
          style={{ backgroundColor: status.SHEETS ? "transparent" : "red" }}
        >
          SHEETS
        </span>
      </div>
      <div>
        <input
          type="checkbox"
          id="beams-status"
          checked={status.BEAMS}
          onChange={() => handleToggle("BEAMS")}
        />
        <span
          id="beams-station"
          style={{ backgroundColor: status.BEAMS ? "transparent" : "red" }}
        >
          BEAMS
        </span>
      </div>
      <div>
        <input
          type="checkbox"
          id="bolts-status"
          checked={status.BOLTS}
          onChange={() => handleToggle("BOLTS")}
        />
        <span
          id="bolts-station"
          style={{ backgroundColor: status.BOLTS ? "transparent" : "red" }}
        >
          BOLTS
        </span>
      </div>
      <div>
        <input
          type="checkbox"
          id="frames-status"
          checked={status.FRAME}
          onChange={() => handleToggle("FRAME")}
        />
        <span
          id="frames-station"
          style={{ backgroundColor: status.FRAME ? "transparent" : "red" }}
        >
          FRAME
        </span>
      </div>
    </div>
  );
}

export default FactoryStatus;