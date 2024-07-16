export function createMember(rowData) {
  const [
    id,
    name,
    gender,
    status,
    carUsage,
    day9,
    day9Stay,
    day10,
    day10Stay,
    day11,
    day9Dinner,
    day10Breakfast,
    day10Lunch,
    day10Dinner,
    day11Breakfast,
    notes,
  ] = rowData;
  return {
    id,
    name,
    gender,
    status,
    carUsage,
    attendance: {
      day9: { present: day9, stay: day9Stay },
      day10: { present: day10, stay: day10Stay },
      day11: { present: day11 },
    },
    meal: {
      day9: { dinner: day9Dinner },
      day10: {
        breakfast: day10Breakfast,
        lunch: day10Lunch,
        dinner: day10Dinner,
      },
      day11: {
        breakfast: day11Breakfast,
      },
    },
    notes,
  };
}

export function createCell(name) {
  return {
    name,
    members: [],
    lastMembers: {
      girl: { name: "", id: "" },
      man: { name: "", id: "" },
    },
    participantCount: 0,
    nonParticipantCount: 0,
  };
}

export function filterSheetData(data) {
  let ageGroup = "";
  const filteredData = data.reduce((acc, row, index) => {
    if (index === 0) {
      ageGroup = row[0];
    } else if (row[0] && row[0].match(/(.+)셀$/)) {
      // 셀 이름
      if (!row[1]) {
        acc.push({ type: "cell", name: row[0].match(/(.+)셀$/)[1] });
      }
    } else if (row[0] && row[0].match(/^[A-Za-z0-9!@#$%^&*()]{10}$/)) {
      // 멤버 이름
      acc.push({ type: "member", data: row });
    }
    return acc;
  }, []);

  return { ageGroup, filteredData };
}

export function groupIntoCells(filteredData) {
  return filteredData.reduce((cells, item, index, array) => {
    if (item.type === "cell") {
      cells.push(createCell(item.name));
    } else if (item.type === "member" && cells.length > 0) {
      const currentCell = cells[cells.length - 1];
      const member = createMember(item.data);

      currentCell.members.push(member);

      if (member.status === "참석") {
        currentCell.participantCount++;
      } else if (member.status === "불참") {
        currentCell.nonParticipantCount++;
      }

      // 마지막 남자와 여자 멤버 업데이트
      if (member.gender === "여") {
        currentCell.lastMembers.girl = { name: member.name, id: member.id };
      } else if (member.gender === "남") {
        currentCell.lastMembers.man = { name: member.name, id: member.id };
      }
    }
    return cells;
  }, []);
}

export function findRowById(sheetValues, dataId) {
  const values = sheetValues;

  let targetRowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === dataId) {
      targetRowIndex = i;
      return targetRowIndex;
    }
  }

  if (targetRowIndex === -1) {
    console.log(`검색 값: ${dataId} 을 찾을 수 없습니다.`);
    return targetRowIndex;
  }
}
