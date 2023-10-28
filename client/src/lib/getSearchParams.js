export default function getSearchParams(searchParam, args) {
  const ans = {};
  if (args && args.length > 0 && searchParam && searchParam.length > 0) {
    for (let arg of args) {
      ans[arg] = searchParam[0].get(arg) ? searchParam[0].get(arg) : arg === "name" ? `#${Math.floor(Math.random() * 100000)}` : false;
    }
  }

  return ans;
}
