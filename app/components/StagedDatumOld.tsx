import { useEffect, useRef, useState } from "react";

import { TagNameMenu, TagValueMenu } from "./TagMenus";
import DatumBarValueInput from "./ValueInput";
import NameInput from "./NameInput";
import { getRandomHex } from "../lib/utils";

import { TagProps } from "../types";
import { FaPlus } from "react-icons/fa6";
import StagedTag from "./StagedTag";

interface StagedTagProps extends TagProps {
  focused: false | "name" | "value";
}

export default function StagedDatum({
  tags,
  addActiveDatum,
}: {
  tags: TagProps[];
  addActiveDatum: (tags: TagProps[]) => void;
}) {
  const [stagedTags, setStagedTags] = useState<StagedTagProps[]>([]);
  const [activeTag, setActiveTag] = useState<TagProps | null>(null);
  const [tagInputValues, setTagInputValues] = useState<string[]>([""]);
  const [isMenuVisible, setIsMenuVisible] = useState<false | "name" | "value">(
    false,
  );
  const [focusedInputIndex, setFocusedInputIndex] = useState<number | null>(
    null,
  );
  const [nameInputValue, setNameInputValue] = useState("");
  // useEffect(() => {
  //   if (newTagNameDummyRef.current) {
  //     setInputWidth(newTagNameDummyRef.current.offsetWidth || 72)
  //   }
  // }, [tagInputValues])

  function beginCreateActiveTag(index: number) {
    setFocusedInputIndex(index);
    if (stagedTags[index] && stagedTags[index].name) {
      setIsMenuVisible("value");
    } else {
      setIsMenuVisible("name");
    }
  }

  function endCreateActiveTag(e: any) {
    setFocusedInputIndex(null);
    if (e.target.value) return;
    if (activeTag !== null) return;
    setIsMenuVisible(false);
  }

  function addTagToStaged(e: any) {
    e.preventDefault();
    // TODO check if it exists already
    // if not, add to tag name menu
    // let newTag
    // if (activeTag) {
    //   newTag = {
    //     color: activeTag.color,
    //     name: activeTag.name,
    //     value: tagInputValues,
    //   }
    //   setActiveTag(null)
    // } else {
    //   newTag = {
    //     color: getRandomHex(6),
    //     name: tagInputValues,
    //   }
    // }
    setStagedTags([
      ...stagedTags,
      {
        color: getRandomHex(6),
        name: nameInputValue,
        value: undefined,
        focused: false,
      },
    ]);
    setNameInputValue("");
    endCreateActiveTag(e);
  }

  function addNameTagToStaging(tag: TagProps) {
    setStagedTags([...stagedTags, tag]);
  }

  function updateValueForTag(e: any, index: number) {
    console.log(e);
    e.preventDefault();
    console.log(e.key);
    if (e.key === "Enter") {
      console.log("Enter!");
      addTagToStaged(e);
    } else {
      const tags = [...stagedTags];
      tags[index] = {
        ...tags[index],
        value: e.target.value,
      };
      setStagedTags(tags);
      // let values = [...tagInputValues]
      // values[index] = e.target.value
      // setTagInputValues(values)
    }
  }

  function submitActiveDatum() {
    addActiveDatum(stagedTags);
    setStagedTags([]);
  }

  function addToActiveTags(tag: StagedTagProps) {
    setStagedTags([...stagedTags, tag]);
  }

  function convertToValuelessTag(tag: TagProps) {
    setActiveTag(tag);
    setIsMenuVisible("value");
  }

  function addValueToActiveTag(value: string) {
    if (!activeTag) return;
    setIsMenuVisible(false);
    addToActiveTags({
      name: activeTag.name,
      value,
      color: activeTag.color,
    });
    setActiveTag(null);
  }

  function addValueToTag(index: number) {
    const tags = [...stagedTags];
    tags[index] = { ...tags[index], value: undefined, focused: "value" };
    setFocusedInputIndex(index);
    setStagedTags(tags);
    setActiveTag(tags[index]);
  }

  function updateNameInput(e) {
    if (e.key === "Enter") {
      addTagToStaged(e);
    } else {
      setNameInputValue(e.target.value);
    }
  }

  return (
    <footer className="flex flex-col relative items-center justify-between bottom-0 h-auto w-full border-t border-neutral-700 bg-black">
      <TagNameMenu
        isVisible={isMenuVisible === "name"}
        tags={tags}
        convertToValuelessTag={convertToValuelessTag}
        createNameTagFromButton={addNameTagToStaging}
      />
      {activeTag && (
        <TagValueMenu
          isVisible={isMenuVisible === "value"}
          nameTag={activeTag}
          tags={tags}
          onClick={() => addValueToActiveTag(i)}
        />
      )}
      <div className="active-datum flex relative items-center justify-between w-full h-[50px] pl-[10px]">
        <div className="flex relative overflow-auto">
          <div className="inline-flex relative grow overflow-auto">
            <div className="inline-flex relative">
              {stagedTags.map((tag, i) => {
                return (
                  <StagedTag
                    key={i}
                    {...tag}
                    onClickAddValue={() => addValueToTag(i)}
                    onValueChange={(e) => updateValueForTag(e, i)}
                  />
                );
              })}
              <form
                onSubmit={addTagToStaged}
                className="flex items-center justify-center"
              >
                <NameInput
                  value={nameInputValue}
                  onFocus={() =>
                    beginCreateActiveTag(tagInputValues.length - 1)
                  }
                  onBlur={(e) =>
                    endCreateActiveTag(e, tagInputValues.length - 1)
                  }
                  onChange={updateNameInput}
                  tagNameTag={activeTag}
                />
                {tagInputValues[tagInputValues.length - 1] && (
                  <button
                    className={`flex items-center rounded-tr rounded-br justify-center w-[30px] h-[30px] text-lg text-black ${focusedInputIndex === stagedTags.length ? "bg-white" : "bg-neutral-700"}`}
                    onClick={addTagToStaged}
                  >
                    <FaPlus />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        {stagedTags.length ? (
          <button
            className="flex items-center justify-center text-3xl w-[50px] h-[50px] text-neutral-500 active:hover:text-white"
            onClick={submitActiveDatum}
          >
            <FaPlus />
          </button>
        ) : null}
      </div>
    </footer>
  );
}
