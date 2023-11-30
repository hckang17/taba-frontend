import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

function getDiagnoseData (memberId = '') {
  const diagnoseData = [
    {diagnoseDate : '2023-11-29', diagnoseResult : '검사결과2'},
    {diagnoseDate : '2023-11-26', diagnoseResult : '검사결과1'},
    {diagnoseDate : '2023-11-01', diagnoseResult : '검사결과3'},
    {diagnoseDate : '2023-12-12', diagnoseResult : '검사결과4'},
    {diagnoseDate : '2023-10-18', diagnoseResult : '검사결과5'},
  ];
  // memberID를 통해 백엔드 DB로부터 검사결과를 불러와, 디스트럭쳐화 해서 검사결과를 받아와야함.
  /**
   * diagnoseDate : 'YYYY-MM-DD' (검사일)
   * diagnoseResult : '검사결과' (검사결과, 임시표시)
   */
  return diagnoseData;
};

const Calendar = () => {
  const nickname = "jungwoo";
  const [diagnoseData, setDiagnoseData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 보여지는 달을 저장하는 state
  const [defaultView, setDefaultView] = useState('dayGridMonth');

  useEffect(() => {
    const fetchDiagnoseData = async () => {
      try {
        const response = await axios.post(
          "http://13.113.206.129:8081/diagnosis/result",
          {
            nickname,
            date: formatDate(currentDate), // 현재 보여지는 달의 날짜를 전송
          }
        );
        //alert(`데이터 성공적으로 받아왔음. ${response.data.toString}`);
        setDiagnoseData(response.data);
      } catch (error) {
        console.error("Error fetching diagnose data:", error);
              alert(`데이터 불러오기 실패. ${nickname}, ${formatDate(currentDate)}`);
      }
    };
  
    fetchDiagnoseData();
  }, [currentDate]); // currentDate가 변경될 때마다 fetchDiagnoseData 실행
  
  
  const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-indexed month를 1-indexed로 변환
      return `${year}/${month}`;
  };

  const handleMonthChange = (info) => {
    // Extract the year and month from the clicked date
    const year = info.view.currentStart.getFullYear();
    const month = (info.view.currentStart.getMonth() + 1).toString().padStart(2, '0');

    // Update the currentDate state to trigger useEffect
    setCurrentDate(new Date(`${year}/${month}`));
  };

  const handleDateClick = (info) => { // 해당날짜에 뜬 검사결과데이터를 클릭했을 경우
    console.log(info.event.extendedProps.diagnosisResult);
    if (info.event.extendedProps && info.event.extendedProps.diagnosisResult) {
      alert(`검사 결과 : ${info.event.extendedProps.diagnosisResult}`);
      // 여기서 새로운 팝업을 띄우거나, 새로운 페이지로 넘어가는 작업 등 추가 가능.
    }
  };

  const formatDiagnosisDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDiagnosisResult = (data) => {
    return `${nickname} 님의 검사결과\n `+
      `findDeadSkinCells: ${data.findDeadSkinCells}\n` +
      `excessSebum: ${data.excessSebum}\n` +
      `erythemaBetweenHairFollicles: ${data.erythemaBetweenHairFollicles}\n` +
      `dandruff: ${data.dandruff}\n` +
      `hairLoss: ${data.hairLoss}\n` +
      `erythemaPustules: ${data.erythemaPustules}\n`;
  };

  const events = diagnoseData.map(data => ({
    title: '두피 자가진단 검사결과',
    date: formatDiagnosisDate(data.diagnosisDate),
    extendedProps: {
      diagnosisResult: formatDiagnosisResult(data),
    },
  }));

  return (
    <div>
      <FullCalendar
        defaultView={defaultView}
        plugins={[dayGridPlugin]}
        eventClick={handleDateClick}
        events={events}
        datesSet={handleMonthChange}
      />
    </div>
  );
};

export default Calendar;

/*
    꼭 참고해서 사용하자 !!!! FullCalendar의 events 프롭 안에 선언할 수 있는 prop 목록

    title (필수): 이벤트의 제목을 나타내는 문자열.
    date (필수): 이벤트가 발생하는 날짜를 나타내는 문자열 또는 Date 객체.
    start (선택적): 이벤트의 시작 날짜 및 시간을 나타내는 Date 객체 또는 문자열.
    end (선택적): 이벤트의 종료 날짜 및 시간을 나타내는 Date 객체 또는 문자열.
    allDay (선택적): 이벤트가 하루 종일인지 여부를 나타내는 불리언 값.
    extendedProps (선택적): 사용자 정의 속성을 나타내는 객체. 이 속성을 사용하여 추가적인 정보를 이벤트에 첨부할 수 있습니다.
    color (선택적): 이벤트의 배경색을 지정하는 문자열.
    editable (선택적): 이벤트가 사용자에 의해 편집 가능한지 여부를 나타내는 불리언 값.
    display (선택적): 이벤트를 표시하는 방법을 나타내는 문자열.
    classNames (선택적): 이벤트에 적용할 CSS 클래스를 나타내는 문자열 또는 문자열 배열.
    
*/