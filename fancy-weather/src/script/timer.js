export function startTimer() {
  function validateSyntax(time) {
    if (time >= 0 && time <= 9) {
      return `0${time}`;
    }
    return time.toString();
  }

  let hours;
  let minutes;
  const time = document.querySelector('.time').innerHTML.split(':');

  hours = parseInt(time[0], 10);
  minutes = parseInt(time[1], 10);

  const t = setInterval(() => {
    minutes += 1;

    if (minutes >= 60) {
      minutes = 0;
      hours += 1;
    }

    if (hours > 23) {
      hours = 0;
      minutes = 0;
    }

    document.querySelector('.time').innerHTML = `${validateSyntax(hours)}:${validateSyntax(minutes)}`;
  }, 60000);

  return t;
}

export function stopTimer(timer) {
  clearInterval(timer);
}
