export const dateConverter = (date: string) => {
  return new Date(date).toDateString();
};

export const formatDistanceToNow = (date: string, includeSeconds?: boolean) => {
  const currentDate = Date.now();
  const dateFromLastUpdate = new Date(date).getTime();

  const differenceInMilliseconds = currentDate - dateFromLastUpdate;

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (includeSeconds === true) {
    switch (true) {
      case seconds < 5:
        return 'less than 5 seconds';
      case seconds < 10:
        return 'less than 10 seconds';
      case seconds < 20:
        return 'less than 20 seconds';
      case seconds < 30:
        return 'less than half minute';
      case seconds < 60:
        return 'less than a minute';
      case seconds < 90:
        return '1 minute';
    }
  }

  switch (true) {
    case seconds <= 30:
      return 'less than a minute';
    case minutes < 2:
      return '1 minute';
    case minutes <= 45:
      return `${minutes} minutes ago`;
    case hours < 2:
      return 'about 1 hour';
    case hours < 24:
      return `about ${hours} hours`;
    case hours < 42:
      return '1 day';
    case days < 45:
      return 'about 1 month';
    case days < 60:
      return 'about 2 months';
    case days < 365:
      return `${months} months`;
    case months <= 15:
      return 'about 1 year';
    case months <= 21:
      return 'over 1 year';
    case years < 2:
      return 'almost 2 years';
    default:
      return `about ${years} years`;
  }
};
