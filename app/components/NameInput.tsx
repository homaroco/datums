export default function NameInput({ value, onBlur, onFocus, onChange }: any) {
  let rounded = value ? "rounded-tl rounded-bl" : "rounded";
  return (
    <input
      className={`new-tag-input flex items-center border ${rounded} px-[5px] h-[30px] pb-[1px] w-[66px] placeholder-neutral-700 border-neutral-700 bg-black focus:border-white text-neutral-700 focus:text-white focus:placeholder-white`}
      placeholder={"New tag"}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={onChange}
    ></input>
  );
}
