export function removeNull<T>(obj: T | any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') removeNull(obj[key]);
      else if (obj[key] == null) delete obj[key];
    });
    return obj;
}