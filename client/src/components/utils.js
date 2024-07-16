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
    lastMember: [],
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
      // 새로운 셀을 추가하기 전에, 이전 셀의 lastMember를 설정합니다 (첫 번째 셀이 아닌 경우)
      if (cells.length > 0) {
        const previousCell = cells[cells.length - 1];
        if (previousCell.members.length > 0) {
          previousCell.lastMember =
            previousCell.members[previousCell.members.length - 1];
        }
      }
      cells.push(createCell(item.name));
    } else if (item.type === "member" && cells.length > 0) {
      const member = createMember(item.data);
      const currentCell = cells[cells.length - 1];
      currentCell.members.push(member);

      if (member.status === "참석") {
        currentCell.participantCount++;
      } else if (member.status === "불참") {
        currentCell.nonParticipantCount++;
      }

      // 현재 아이템이 filteredData의 마지막 요소이거나
      // 다음 아이템이 새로운 셀의 시작인 경우, 이 멤버를 lastMember로 설정
      if (index === array.length - 1 || array[index + 1].type === "cell") {
        currentCell.lastMember = member;
      }
    }
    return cells;
  }, []);
}

export function findRowById(sheetData, dataId) {
  const values = sheetData.values;

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
