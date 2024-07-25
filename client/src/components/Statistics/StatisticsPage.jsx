import React, { useState, useMemo } from "react";
import "./StatisticsPage.css";

// 유틸리티 함수들
const calculateTotalAttendance = (allCellData) => {
  let total = 0;
  Object.values(allCellData).forEach(({ cells }) => {
    cells.forEach((cell) => {
      total += cell.participantCount;
    });
  });
  return total;
};

const calculateDailyAttendance = (allCellData) => {
  const daily = { day9: 0, day10: 0, day11: 0 };
  Object.values(allCellData).forEach(({ cells }) => {
    cells.forEach((cell) => {
      cell.members.forEach((member) => {
        if (member.attendance.day9.present === "참석") daily.day9++;
        if (member.attendance.day10.present === "참석") daily.day10++;
        if (member.attendance.day11.present === "참석") daily.day11++;
      });
    });
  });
  return daily;
};

const calculateMealCounts = (allCellData) => {
  const meals = {
    day9: { dinner: 0 },
    day10: { breakfast: 0, lunch: 0, dinner: 0 },
    day11: { breakfast: 0 },
  };
  Object.values(allCellData).forEach(({ cells }) => {
    cells.forEach((cell) => {
      cell.members.forEach((member) => {
        if (member.meal.day9.dinner === "O") meals.day9.dinner++;
        if (member.meal.day10.breakfast === "O") meals.day10.breakfast++;
        if (member.meal.day10.lunch === "O") meals.day10.lunch++;
        if (member.meal.day10.dinner === "O") meals.day10.dinner++;
        if (member.meal.day11.breakfast === "O") meals.day11.breakfast++;
      });
    });
  });
  return meals;
};

const calculateCarUsage = (allCellData) => {
  const carUsage = {
    "첫날 선발": { count: 0, members: [] },
    "첫날 후발": { count: 0, members: [] },
    둘째날: { count: 0, members: [] },
  };
  Object.values(allCellData).forEach(({ cells }) => {
    cells.forEach((cell) => {
      cell.members.forEach((member) => {
        if (carUsage[member.carUsage]) {
          carUsage[member.carUsage].count++;
          carUsage[member.carUsage].members.push(
            `${member.name} (${member.gender})`
          );
        }
      });
    });
  });
  return carUsage;
};

const calculateAccommodation = (allCellData) => {
  const accommodation = {};
  Object.entries(allCellData).forEach(([ageGroup, { cells }]) => {
    accommodation[ageGroup] = {};
    cells.forEach((cell) => {
      accommodation[ageGroup][cell.name] = cell.members
        .filter(
          (member) =>
            member.attendance.day9.stay === "O" ||
            member.attendance.day10.stay === "O"
        )
        .map((member) => ({
          name: member.name,
          gender: member.gender,
          stay: [
            member.attendance.day9.stay === "O" ? "9" : null,
            member.attendance.day10.stay === "O" ? "10" : null,
          ].filter(Boolean),
        }));
    });
  });
  return accommodation;
};

// 숙박 인원 표시 컴포넌트
const AccommodationMember = ({ name, stay }) => {
  let stayInfo;
  if (stay.includes("9") && stay.includes("10")) {
    stayInfo = <div className="stay-date all">ALL</div>;
  } else if (stay.includes("9")) {
    stayInfo = <div className="stay-date nine">9일</div>;
  } else if (stay.includes("10")) {
    stayInfo = <div className="stay-date ten">10일</div>;
  }

  return (
    <div className="accommodation-member">
      <div className="name">{name}</div>
      <div className="stay-info">{stayInfo}</div>
    </div>
  );
};

// 성별별 숙박 인원 표시 컴포넌트
const GenderAccommodation = ({ members, gender }) => {
  const sortedMembers = members.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`gender-accommodation ${gender}`}>
      <h4>
        {gender === "male" ? "남" : "여"} ({members.length}명)
      </h4>
      <div className="accommodation-members">
        {sortedMembers.map((member, index) => (
          <AccommodationMember
            key={index}
            name={member.name}
            stay={member.stay}
          />
        ))}
      </div>
    </div>
  );
};

// 셀별 숙박 인원 표시 컴포넌트
const CellAccommodation = ({ cellName, members, filter }) => {
  const filteredMembers = members.filter((member) => {
    if (filter === "전체") return true;
    if (filter === "9일")
      return member.stay.includes("9") && !member.stay.includes("10");
    if (filter === "10일")
      return member.stay.includes("10") && !member.stay.includes("9");
    return false;
  });

  const maleMembers = filteredMembers.filter(
    (member) => member.gender === "남"
  );
  const femaleMembers = filteredMembers.filter(
    (member) => member.gender === "여"
  );

  if (filteredMembers.length === 0) return null;

  return (
    <div className="cell-accommodation">
      <h3>
        {cellName}셀 ({filteredMembers.length}명)
      </h3>
      {maleMembers.length > 0 && (
        <GenderAccommodation members={maleMembers} gender="male" />
      )}
      {femaleMembers.length > 0 && (
        <GenderAccommodation members={femaleMembers} gender="female" />
      )}
    </div>
  );
};

export default function StatisticsPage({ allCellData }) {
  const totalAttendance = calculateTotalAttendance(allCellData);
  const dailyAttendance = calculateDailyAttendance(allCellData);
  const mealCounts = calculateMealCounts(allCellData);
  const carUsage = calculateCarUsage(allCellData);

  const [filter, setFilter] = useState("전체");

  const accommodation = useMemo(
    () => calculateAccommodation(allCellData),
    [allCellData]
  );

  const ageGroupOrder = ["20-27세", "28-32세", "33-세", "새가족셀"];

  const sortedAccommodation = useMemo(() => {
    return ageGroupOrder.reduce((acc, ageGroup) => {
      if (accommodation[ageGroup]) {
        const filteredCells = Object.entries(accommodation[ageGroup]).reduce(
          (cellAcc, [cellName, members]) => {
            const filteredMembers = members.filter((member) => {
              if (filter === "전체") return true;
              if (filter === "9일")
                return member.stay.includes("9") && !member.stay.includes("10");
              if (filter === "10일")
                return member.stay.includes("10") && !member.stay.includes("9");
              return false;
            });
            if (filteredMembers.length > 0) {
              cellAcc[cellName] = filteredMembers;
            }
            return cellAcc;
          },
          {}
        );
        if (Object.keys(filteredCells).length > 0) {
          acc[ageGroup] = filteredCells;
        }
      }
      return acc;
    }, {});
  }, [accommodation, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countByDay = useMemo(() => {
    const counts = { day9: 0, day10: 0 };
    Object.values(accommodation).forEach((ageGroup) => {
      Object.values(ageGroup).forEach((cell) => {
        cell.forEach((member) => {
          if (member.stay.includes("9")) counts.day9++;
          if (member.stay.includes("10")) counts.day10++;
        });
      });
    });
    return counts;
  }, [accommodation]);

  const getCurrentCount = () => {
    let count = 0;
    Object.values(sortedAccommodation).forEach((ageGroup) => {
      Object.values(ageGroup).forEach((cell) => {
        count += cell.length;
      });
    });
    return count;
  };

  return (
    <div className="statistics-page">
      <h1>수련회 참석 통계</h1>

      <section className="total-attendance">
        <h2>전체 참석 인원</h2>
        <p>{totalAttendance}명</p>
      </section>

      <section className="daily-attendance">
        <h2>일별 참석 인원</h2>
        <ul>
          <li>09일(금): {dailyAttendance.day9}명</li>
          <li>10일(토): {dailyAttendance.day10}명</li>
          <li>11일(일): {dailyAttendance.day11}명</li>
        </ul>
      </section>

      <section className="meal-counts">
        <h2>식사별 식수 인원</h2>
        <ul>
          <li>09일(금) 저녁: {mealCounts.day9.dinner}명 🍽️</li>
          <hr />
          <li>10일(토) 아침: {mealCounts.day10.breakfast}명 🥪</li>
          <li>10일(토) 점심: {mealCounts.day10.lunch}명 🍽️</li>
          <li>10일(토) 저녁: {mealCounts.day10.dinner}명 🍽️</li>
          <hr />
          <li>11일(일) 아침: {mealCounts.day11.breakfast}명 🍽️</li>
        </ul>
      </section>

      <section className="car-usage">
        <h2>차량별 탑승 인원</h2>
        {Object.entries(carUsage).map(([type, data]) => (
          <div key={type} className="car-type">
            <h3>
              {type}: {data.count}명
            </h3>
            <ul>
              {data.members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="accommodation">
        <h2>숙박 인원</h2>
        <div className="accommodation-filter">
          {filter === "전체" ? (
            <span className="accommodation-count">
              전체 (9일: {countByDay.day9}명, 10일: {countByDay.day10}명)
            </span>
          ) : (
            <span className="accommodation-count">
              하루만 ({filter}: {getCurrentCount()}명)
            </span>
          )}
          <select value={filter} onChange={handleFilterChange}>
            <option value="전체">전체</option>
            <option value="9일">하루만 - 9일</option>
            <option value="10일">하루만 - 10일</option>
          </select>
        </div>
        {Object.entries(sortedAccommodation).map(([ageGroup, cells]) => (
          <div key={ageGroup} className="age-group-accommodation">
            <h3>{ageGroup}</h3>
            {Object.entries(cells).map(([cellName, members]) => (
              <CellAccommodation
                key={cellName}
                cellName={cellName}
                members={members}
                filter={filter}
              />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
