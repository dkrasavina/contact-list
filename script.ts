class FormValidation {
  selectors: { form: string; fieldError: string } = {
    form: "[data-js-form]",
    fieldError: "[data-js-form-error]",
  };

  errorMessages = {
    valueMissing: "Fill it",
    patternMismatch: "Not correct",
    tooShort: "Short",
  };

  constructor() {
    this.bindEvents();
  }

  manageError(errorMessages: string[]) {
    if (errorMessages.length > 0) {
      const errorElement = document.querySelector<HTMLDivElement>(this.selectors.fieldError);

      if (errorElement === null) {
        return;
      }

      errorElement.style.visibility = "visible";
      setTimeout(() => (errorElement.style.visibility = "hidden"), 4000);
    }
  }

  validateField(fieldControlElement: HTMLInputElement) {
    console.log(fieldControlElement);
    const errors = fieldControlElement.validity;
    const errorMessages: string[] = [];

    Object.entries(this.errorMessages).forEach(([errorType, errorMessage]) => {
      if (errors[errorType as keyof typeof this.errorMessages]) {
        errorMessages.push(errorMessage);
      }
    });

    if (errorMessages.length > 0) {
      const isError = true;

      fieldControlElement.classList.toggle("is-invalid", isError);
      setTimeout(() => fieldControlElement.classList.remove("is-invalid"), 4000);
      fieldControlElement.value = "";
    }

    fieldControlElement.placeholder = errorMessages.join(", ");

    setTimeout(() => (fieldControlElement.placeholder = fieldControlElement.name), 4000);

    this.manageError(errorMessages);

    const isValid = errorMessages.length === 0;
    fieldControlElement.ariaInvalid = (!isValid).toString();
    return isValid;
  }

  onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target === null) {
      return;
    }

    const isFormField = target.closest(this.selectors.form);

    if (isFormField) {
      this.validateField(target);
    }
  }

  bindEvents() {
    document.addEventListener("blur", (event) => this.onBlur(event), {
      capture: true,
    });
  }
}

type PersonInfo = {
  Name: string;
  Vacancy: string;
  Phone: string;
};

const VALIDATOR = new FormValidation();

const listOfContacts: Record<string, PersonInfo[]> = {
  A: [],
  B: [],
  C: [],
  D: [],
  E: [],
  F: [],
  G: [],
  H: [],
  I: [],
  J: [],
  K: [],
  L: [],
  M: [],
  N: [],
  O: [],
  P: [],
  Q: [],
  R: [],
  S: [],
  T: [],
  U: [],
  V: [],
  W: [],
  X: [],
  Y: [],
  Z: [],
};

const storedContacts = localStorage.getItem("contactList");

let contactList = listOfContacts;
if (storedContacts) {
  contactList = JSON.parse(storedContacts);
}

class AddingInfo {
  selectors = {
    form: "[data-js-form]",
    list: "[data-js-list]",
  };

  constructor() {
    this.events();
  }

  getting() {
    const formElement = document.querySelector<HTMLFormElement>(this.selectors.form);
    if (formElement === null) {
      return;
    }

    const inputs = [...formElement.elements].filter((el) => el instanceof HTMLInputElement);

    const requiredControlElements = inputs.filter((element) => element.required);

    let isFormValid = requiredControlElements.every((element) => VALIDATOR.validateField(element));

    if (isFormValid) {
      let formData = new FormData(formElement);

      const personInfo = Object.fromEntries(formData) as PersonInfo;
      console.log("PERSONINFO", personInfo);
      let firstLetter = personInfo.Name[0].toUpperCase();
      contactList[firstLetter].push(personInfo);
      localStorage.setItem("contactList", JSON.stringify(contactList));
      // console.log(
      //   "my local storage",
      //   JSON.parse(localStorage.getItem("contactList"))
      // );

      this.addingNumber(firstLetter, personInfo);
    } else {
      return;
    }
  }

  addingNumber(firstLetter: string, personInfo: { Name: string; Vacancy: string; Phone: string }) {
    const letterWithNumberParent = document.querySelector(`#wrapped_${firstLetter}`);
    if (letterWithNumberParent === null) {
      return;
    }

    const letterWithNumber = letterWithNumberParent.querySelector("div");
    if (letterWithNumber === null) {
      return;
    }
    letterWithNumber.classList.add("wrapped_contact_letter");

    const personBlockWithCross = document.createElement("div");
    personBlockWithCross.classList.add("contact_letter_info");

    const cross = document.createElement("div");
    cross.classList.add("cross_delete");

    personBlockWithCross.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const personBlock = document.createElement("div");
    personBlock.classList.add("person-block");

    const personInfoComponent = Object.entries(personInfo);
    const personInfoComponentList = personInfoComponent.map((item) => item.join(": "));
    personInfoComponentList.forEach((item) => {
      let personInnerBlock = document.createElement("div");
      personInnerBlock.textContent = item;
      personBlock.append(personInnerBlock);
    });

    const neededLetter = document.querySelector(`#${firstLetter}`)!;

    personBlockWithCross.append(personBlock);
    personBlockWithCross.append(cross);

    if (letterWithNumberParent.querySelector(".all_contact_letter_info") === null) {
      const allContactLetterInfo = document.createElement("div");
      allContactLetterInfo.classList.add("all_contact_letter_info");
      allContactLetterInfo.classList.add("hidden");
      allContactLetterInfo.append(personBlockWithCross);
      letterWithNumber.after(allContactLetterInfo);
    } else {
      const allContactLetterInfo = letterWithNumberParent.querySelector(".all_contact_letter_info");
      if (allContactLetterInfo === null) {
        return;
      }

      allContactLetterInfo.append(personBlockWithCross);
    }

    const numberContacts = contactList[firstLetter].length;

    if (letterWithNumber.querySelector(".number") === null) {
      const numberContactsElement = document.createElement("div");
      numberContactsElement.textContent = numberContacts.toString();
      numberContactsElement.classList.add("number");
      neededLetter.after(numberContactsElement);
    } else {
      const numberContactsElement = letterWithNumber.querySelector(".number");
      if (numberContactsElement === null) {
        return;
      }
      numberContactsElement.textContent = numberContacts.toString();
    }

    cross.addEventListener("click", (event) => {
      if (event.target === null) {
        return;
      }

      if (!(event.target instanceof HTMLDivElement)) {
        return;
      }
      const letterBlock = event.target.closest(".contact_letter")!;
      const contactBlock = letterBlock.querySelector(".contact_letter_info")!;
      const contactInfo = contactBlock.querySelector(".person-block")!;
      const infoDivs = contactInfo.querySelectorAll<HTMLDivElement>("div")!;

      const person: Record<string, string> = {};

      infoDivs.forEach((div) => {
        if (div.textContent === null) {
          return;
        } else {
          const [key, value] = div.textContent.split(":");
          if (key && value) {
            person[key.trim()] = value.trim();
          }
        }
      });

      contactBlock.remove();

      const contactInfoFirstLetter = letterBlock.querySelector(".letter")!;
      const contactInfoNumber = letterBlock.querySelector(".number")!;
      let contactInfoNumberCurrent = Number(contactInfoNumber.textContent);

      const contactInfoNumberNew = contactInfoNumberCurrent - 1;
      if (contactInfoNumberNew == 0) {
        contactInfoNumber.textContent = "";
      } else {
        contactInfoNumber.textContent = contactInfoNumberNew.toString();
      }

      const letter = String(contactInfoFirstLetter.textContent);

      const indexForRemoving = contactList[letter].findIndex((contact) => contact === person);
      contactList[letter].splice(indexForRemoving, 1);
      localStorage.setItem("contactList", JSON.stringify(contactList));
      // console.log(
      //   "my local storage",
      //   JSON.parse(localStorage.getItem("contactList"))
      // );

      event.stopPropagation();
    });
  }

  onSubmit(event: MouseEvent) {
    event.preventDefault();
    this.getting();
  }

  events() {
    const addButton = document.querySelector<HTMLButtonElement>(".button_add");
    if (addButton === null) {
      return;
    }
    addButton.addEventListener("click", (event) => this.onSubmit(event));
  }
}

const ADDING = new AddingInfo();
const bigLetters = (() => {
  const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
  return caps;
})();

bigLetters.forEach((letter) => {
  if (contactList[letter].length > 0) {
    contactList[letter].forEach((item) => {
      ADDING.addingNumber(letter, item);
    });
  }
});
// ADDING.addingNumber("D", {Name: "derra", Vacancy:"djff", Phone: "+79999999999"})

function visualizationInfo() {
  const columnElement = document.querySelector<HTMLDivElement>(".contacts");

  if (columnElement === null) {
    return;
  }
  columnElement.addEventListener("click", (event) => {
    if (event.target === null) {
      return;
    }

    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const letter = event.target.closest(".contact_letter");
    if (letter) {
      const personBlockWithCross = letter.querySelector(".all_contact_letter_info");
      if (personBlockWithCross) {
        personBlockWithCross.classList.toggle("hidden");
      }
      event.stopImmediatePropagation();
    }
  });
}
visualizationInfo();

function clearAll() {
  const columnElement = document.querySelector<HTMLButtonElement>(".button_clear");
  if (columnElement === null) {
    return;
  }
  columnElement.addEventListener("click", () => {
    const allNumbers = document.querySelectorAll(".number");
    const allLetters = document.querySelectorAll(".letter");
    const allContactLetterInfo = document.querySelectorAll(".all_contact_letter_info");
    allContactLetterInfo.forEach((element) => element.remove());
    allNumbers.forEach((element) => (element.textContent = ""));
    allLetters.forEach((element) => (contactList[String(element.textContent)] = []));

    console.log(contactList);

    localStorage.setItem("contactList", JSON.stringify(contactList));
    // console.log(
    //   "my local storage",
    //   JSON.parse(localStorage.getItem("contactList"))
    // );
  });
}

clearAll();

const showBtn = document.querySelector("#show-dialog")!;
const dialog = document.querySelector<HTMLDialogElement>("#dialog")!;
const jsCloseBtn = dialog.querySelector("#js-close")!;

showBtn.addEventListener("click", () => {
  dialog.showModal();

  const letters = (() => {
    const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
    return caps;
  })();

  const allContactInfo = document.createElement("div");
  allContactInfo.classList.add("search_all_contacts");
  allContactInfo.classList.toggle("hidden");

  letters.forEach((letter) => {
    if (contactList[letter].length != 0) {
      contactList[letter].forEach((item) => {
        const searchPersonBlock = document.createElement("div");
        searchPersonBlock.classList.add("search_person_block");

        const searchOnePersonBlock = document.createElement("div");
        searchOnePersonBlock.classList.add("search_one_person_block");
        for (const [key, value] of Object.entries(item)) {
          const infoDiv = document.createElement("div");
          infoDiv.textContent = `${key}: ${value}`;
          searchOnePersonBlock.appendChild(infoDiv);
        }
        const crossAndNote = document.createElement("div");
        crossAndNote.classList.add("cross_and_note");

        const cross = document.createElement("div");
        cross.classList.add("search_person_block_cross");

        cross.addEventListener("click", (event) => {
          if (event.target === null) {
            return;
          }

          if (!(event.target instanceof HTMLElement)) {
            return;
          }
          const closeSearchPersonBlock = event.target.closest(".search_person_block")!;
          const closeSearchOnePersonBlock = closeSearchPersonBlock.querySelector(".search_one_person_block")!;
          const infoDivs = closeSearchOnePersonBlock.querySelectorAll("div")!;
          const person: Record<string, string> = {};

          infoDivs.forEach((div) => {
            const [key, value] = String(div.textContent).split(":");
            if (key && value) {
              person[key.trim()] = value.trim();
            }
          });

          const nameFirstLetter = person.Name[0].toUpperCase();
          const indexForRemoving = contactList[nameFirstLetter].findIndex((contact) => contact === person);
          contactList[nameFirstLetter].splice(indexForRemoving, 1);
          localStorage.setItem("contactList", JSON.stringify(contactList));
          // console.log(
          //   "my local storage",
          //   JSON.parse(localStorage.getItem("contactList"))
          // );

          const contactExectLetterElement = document.querySelector(`#${nameFirstLetter}`)!;
          const contactLetterElement = contactExectLetterElement.closest(".contact_letter")!;
          const contactNumberElement = contactLetterElement.querySelector(".number")!;
          const closeContactLetterInfo = contactLetterElement.querySelector(".contact_letter_info")!;

          closeSearchPersonBlock.remove();
          closeContactLetterInfo.remove();

          let contactExectNumber = Number(contactNumberElement.textContent);
          const contactExectNumberNew = contactExectNumber - 1;
          if (contactExectNumberNew == 0) {
            contactNumberElement.textContent = "";
          } else {
            contactNumberElement.textContent = contactExectNumberNew.toString();
          }

          event.stopPropagation();
        });

        const img = document.createElement("img");
        img.src = "./images/note_pencil_icon.png";
        img.classList.add("image_note");
        img.id = "show-edit";

        const editWindow = document.querySelector<HTMLDialogElement>("#edit")!;

        const editFuction = function (event: MouseEvent) {
          if (event.target === null) {
            return;
          }

          if (!(event.target instanceof HTMLElement)) {
            return;
          }
          const editSearchPersonBlock = event.target.closest(".search_person_block")!;
          const editSearchOnePersonBlock = editSearchPersonBlock.querySelector(".search_one_person_block")!;

          editWindow.showModal();

          const editInfoDivs = editSearchOnePersonBlock.querySelectorAll("div");
          const editPerson: Record<string, string> = {};

          editInfoDivs.forEach((div) => {
            const [key, value] = String(div.textContent).split(":");
            if (key && value) {
              editPerson[key.trim()] = value.trim();
            }
          });

          const editNameElement = editWindow.querySelector<HTMLInputElement>("#edit_name")!;
          editNameElement.value = editPerson.Name;
          const firstLetterOld = editPerson.Name[0].toUpperCase();
          const editVacancyElement = editWindow.querySelector<HTMLInputElement>("#edit_vacancy")!;
          editVacancyElement.value = editPerson.Vacancy;
          const editPhoneElement = editWindow.querySelector<HTMLInputElement>("#edit_phone")!;
          editPhoneElement.value = editPerson.Phone;

          const btnEdit = editWindow.querySelector<HTMLButtonElement>(".edit_button")!;

          const editButtonFunction = function (event: MouseEvent) {
            event.stopPropagation();
            const inputsElements = editWindow.querySelector<HTMLFormElement>("#edit_form")!;
            const requiredEditElementsInput = [...inputsElements.elements].filter(
              (element) => element instanceof HTMLInputElement
            );

            const requiredEditElements = requiredEditElementsInput.filter((element) => element.required);
            let isFormValid = requiredEditElements.every((element) => VALIDATOR.validateField(element));

            if (isFormValid) {
              console.log("изначально :", contactList);

              let formDataEdit = new FormData(inputsElements);

              const personInfoEdit = Object.fromEntries(formDataEdit) as PersonInfo;

              let firstLetterEdit = personInfoEdit.Name[0].toUpperCase();

              const indexForRemovingEdit = contactList[firstLetterOld].findIndex(
                (contact) => contact === personInfoEdit
              );
              contactList[firstLetterOld].splice(indexForRemovingEdit, 1);
              console.log("убрали :", contactList);

              contactList[firstLetterEdit].push(personInfoEdit);
              console.log("добавили :", contactList);
              localStorage.setItem("contactList", JSON.stringify(contactList));

              ADDING.addingNumber(firstLetterEdit, personInfoEdit);

              const contactExectLetterElement = document.querySelector(`#${firstLetterOld}`)!;
              const contactLetterElement = contactExectLetterElement.closest(".contact_letter")!;
              const contactNumberElement = contactLetterElement.querySelector(".number")!;
              const closeContactLetterInfo = contactLetterElement.querySelector(".contact_letter_info")!;

              closeContactLetterInfo.remove();
              let contactExectNumber = Number(contactNumberElement.textContent);
              const contactExectNumberNew = contactExectNumber - 1;
              if (contactExectNumberNew == 0) {
                contactNumberElement.textContent = "";
              } else {
                contactNumberElement.textContent = contactExectNumberNew.toString();
              }

              editInfoDivs.forEach((el) => {
                const key = String(el.textContent).split(":")[0].trim();
                if (key !== "Name" && key !== "Vacancy" && key !== "Phone") {
                  return;
                }
                if (personInfoEdit[key]) {
                  el.textContent = `${key}: ${personInfoEdit[key]}`;
                }
              });
              editWindow.close();
            } else {
              return;
            }

            btnEdit.removeEventListener("click", editButtonFunction);
          };
          btnEdit.addEventListener("click", editButtonFunction);

          const editCloseBtn = editWindow.querySelector("#edit-close")!;
          editCloseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            editWindow.close();
          });
        };
        img.addEventListener("click", editFuction);

        crossAndNote.append(img);
        crossAndNote.append(cross);

        searchPersonBlock.append(searchOnePersonBlock);
        searchPersonBlock.append(crossAndNote);

        allContactInfo.append(searchPersonBlock);
      });
    }
  });

  const searchInfoBlock = dialog.querySelector(".info_block")!;
  searchInfoBlock.append(allContactInfo);

  function searching() {
    const all = dialog.querySelector(".search_all_contacts")!;
    const input = dialog.querySelector<HTMLInputElement>(".search_input")!;
    const filter = input.value;
    const ul = allContactInfo;
    const li = ul.querySelectorAll<HTMLElement>(".search_person_block");

    all.classList.add("flexim");
    for (let i = 0; i < li.length; i++) {
      let block = li[i].querySelector(".search_one_person_block")!;
      let blockDivs = block.querySelectorAll("div");
      const personSearching: Record<string, string> = {};

      blockDivs.forEach((div) => {
        const [key, value] = String(div.textContent).split(":");
        if (key && value) {
          personSearching[key.trim()] = value.trim();
        }
      });

      const txtValue = personSearching.Name;
      if (txtValue.indexOf(filter) > -1) {
        li[i].style.display = "flex";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  const searchingInputString = document.querySelector(".search_input")!;

  searchingInputString.addEventListener("input", searching);

  const showAll = dialog.querySelector(".show_all")!;
  const searchPersonBlock = dialog.querySelector(".search_person_block");
  showAll.addEventListener("click", () => {
    allContactInfo.classList.toggle("hidden");
  });
});

jsCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dialog.close();
  const list = dialog.querySelector(".search_all_contacts")!;
  list.remove();
});
