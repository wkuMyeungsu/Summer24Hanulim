import React, { useState, useEffect } from "react";
import "./MemberEditModal.css";

const mealStructure = [
  {
    dayKey: "day9",
    dayLabel: "9일(금)",
    meals: [{ mealKey: "dinner", mealLabel: "🍽️저녁" }],
  },
  {
    dayKey: "day10",
    dayLabel: "10일(토)",
    meals: [
      { mealKey: "breakfast", mealLabel: "🥪아침" },
      { mealKey: "lunch", mealLabel: "🍽️점심" },
      { mealKey: "dinner", mealLabel: "🍽️저녁" },
    ],
  },
  {
    dayKey: "day11",
    dayLabel: "11일(일)",
    meals: [{ mealKey: "breakfast", mealLabel: "🍽️아침" }],
  },
];

const attendanceStructure = [
  {
    dayKey: "day9",
    dayLabel: "9일(금)",
    attendance: {
      key: "present",
      label: "참석",
      options: [
        { value: "", label: "8/9(금) 참석여부" },
        { value: "참석", label: "🙆‍♂️참석" },
        { value: "불참", label: "🙅불참" },
      ],
    },
    stay: {
      key: "stay",
      label: "숙박",
      options: [
        { value: "", label: "8/9(금) 숙박여부" },
        { value: "O", label: "🛏️숙박" },
        { value: "X", label: "🙅‍♀️숙박 안함" },
      ],
    },
  },
  {
    dayKey: "day10",
    dayLabel: "10일(토)",
    attendance: {
      key: "present",
      label: "참석",
      options: [
        { value: "", label: "8/10(토) 참석여부" },
        { value: "참석", label: "🙆‍♂️참석" },
        { value: "불참", label: "🙅불참" },
      ],
    },
    stay: {
      key: "stay",
      label: "숙박",
      options: [
        { value: "", label: "8/10(토) 숙박여부" },
        { value: "O", label: "🛏️숙박" },
        { value: "X", label: "🙅‍♀️숙박 안함" },
      ],
    },
  },
  {
    dayKey: "day11",
    dayLabel: "11일(일)",
    attendance: {
      key: "present",
      label: "참석",
      options: [
        { value: "", label: "8/11(일) 참석여부" },
        { value: "참석", label: "🙆‍♂️참석" },
        { value: "불참", label: "🙅불참" },
      ],
    },
  },
];

export default function MemberEditModal({ member, onSave, onClose }) {
  const [editedMember, setEditedMember] = useState(member);

  useEffect(() => {
    setEditedMember(member);
  }, [member]);

  const handleChange = (e) => {
    const { name, checked, type, value } = e.target;
    setEditedMember((prev) => {
      if (name.includes(".")) {
        const [category, day, field] = name.split(".");
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [day]: {
              ...prev[category][day],
              [field]: type === "checkbox" ? checked : value,
            },
          },
        };
      }
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedMember);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>셀원 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={editedMember.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="gender">성별</label>
                <select
                  id="gender"
                  name="gender"
                  value={editedMember.gender}
                  onChange={handleChange}
                >
                  <option value="">성별 선택</option>
                  <option value="남">👨남</option>
                  <option value="여">👧여</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="status">참석여부</label>
                <select
                  id="status"
                  name="status"
                  value={editedMember.status}
                  onChange={handleChange}
                >
                  <option value="">참석여부 선택</option>
                  <option value="참석">✅참석</option>
                  <option value="불참">❌불참</option>
                </select>
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="carUsage">차량 이용</label>
                <select
                  id="carUsage"
                  name="carUsage"
                  value={editedMember.carUsage}
                  onChange={handleChange}
                >
                  <option value="">차량이용 선택</option>
                  <option value="첫날 선발">첫날 선발 (14:00)</option>
                  <option value="첫날 후발">첫날 후발 (19:00)</option>
                  <option value="둘째날">둘째날 (08:30)</option>
                  <option value="해당없음">해당없음</option>
                </select>
              </div>
            </div>
          </div>

          <div className="attendance-group">
            <h3>참석 및 숙박 정보</h3>
            {attendanceStructure.map(
              ({ dayKey, dayLabel, attendance, stay }) => (
                <div key={dayKey} className="attendance-row">
                  <div className="attendance-column">
                    <div className="form-group">
                      <label htmlFor={`attendance-${dayKey}`}>
                        {dayLabel} - {attendance.label}
                      </label>
                      <select
                        id={`attendance-${dayKey}`}
                        name={`attendance.${dayKey}.${attendance.key}`}
                        value={editedMember.attendance[dayKey][attendance.key]}
                        onChange={handleChange}
                      >
                        {attendance.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {stay && (
                    <div className="attendance-column">
                      <div className="form-group">
                        <label htmlFor={`stay-${dayKey}`}>
                          {dayLabel} - {stay.label}
                        </label>
                        <select
                          id={`stay-${dayKey}`}
                          name={`attendance.${dayKey}.${stay.key}`}
                          value={editedMember.attendance[dayKey][stay.key]}
                          onChange={handleChange}
                        >
                          {stay.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <div className="meal-group">
            <h3>식사 정보</h3>
            {mealStructure.map(({ dayKey, dayLabel, meals }) => (
              <div key={dayKey} className="meal-day">
                <div className="meal-day-label">{dayLabel}</div>
                <div className="meal-options">
                  {meals.map(({ mealKey, mealLabel }) => (
                    <div key={mealKey} className="meal-option">
                      <input
                        type="checkbox"
                        id={`meal-${dayKey}-${mealKey}`}
                        name={`meal.${dayKey}.${mealKey}`}
                        checked={editedMember.meal[dayKey][mealKey] === "O"}
                        onChange={(e) => {
                          const newValue = e.target.checked ? "O" : "X";
                          handleChange({
                            target: {
                              name: `meal.${dayKey}.${mealKey}`,
                              value: newValue,
                              type: "text",
                            },
                          });
                        }}
                      />
                      <label htmlFor={`meal-${dayKey}-${mealKey}`}>
                        {mealLabel}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="notes">비고:</label>
            <textarea
              id="notes"
              name="notes"
              value={editedMember.notes}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            <button type="submit">저장</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
