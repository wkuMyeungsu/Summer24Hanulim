// utils.js

export function createMember(rowData) {
  const [
    name,
    gender,
    status,
    carUsage,
    day9,
    day9Stay,
    day10,
    day10Stay,
    day11,
    notes,
  ] = rowData;
  return {
    name,
    gender,
    status,
    carUsage,
    attendance: {
      day9: { present: day9, stay: day9Stay },
      day10: { present: day10, stay: day10Stay },
      day11,
    },
    notes,
  };
}

export function createCell(name) {
  return {
    name,
    members: [],
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
      if (!row[1]) {
        acc.push({ type: "cell", name: row[0].match(/(.+)셀$/)[1] });
      }
    } else if (row[0] !== "이름" && row[0] && isNaN(Number(row[0]))) {
      acc.push({ type: "member", data: row });
    }
    return acc;
  }, []);

  return { ageGroup, filteredData };
}

export function groupIntoCells(filteredData) {
  return filteredData.reduce((cells, item) => {
    if (item.type === "cell") {
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
    }
    return cells;
  }, []);
}
