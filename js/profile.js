(() => {
  "use strict";

  const form = document.querySelector("#profile-form");
  const fields = [...form.querySelectorAll("input")];
  const message = document.querySelector("#form-message");
  const editButton = document.querySelector("#edit-profile");
  const actions = document.querySelector("#form-actions");
  let savedProfile = window.StoreStorage.getProfile();

  function setFields(profile) {
    fields.forEach((field) => {
      field.value = profile[field.name] || "";
      field.removeAttribute("aria-invalid");
    });
  }

  function setEditing(editing) {
    fields.forEach((field) => { field.disabled = !editing; });
    editButton.classList.toggle("hidden", editing);
    actions.classList.toggle("hidden", !editing);
    if (editing) fields[0].focus();
  }

  setFields(savedProfile);

  editButton.addEventListener("click", () => {
    message.textContent = "";
    setEditing(true);
  });

  document.querySelector("#cancel-edit").addEventListener("click", () => {
    setFields(savedProfile);
    message.textContent = "Changes discarded.";
    message.className = "form-message";
    setEditing(false);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";
    let firstInvalid = null;
    fields.forEach((field) => {
      const valid = field.value.trim() !== "" && field.validity.valid;
      field.setAttribute("aria-invalid", String(!valid));
      if (!valid && firstInvalid === null) firstInvalid = field;
    });
    if (firstInvalid) {
      message.textContent = "Please check the highlighted fields and enter valid information.";
      message.className = "form-message form-error";
      firstInvalid.focus();
      return;
    }

    const profile = Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
    if (!window.StoreStorage.saveProfile(profile)) {
      message.textContent = "Your changes couldn't be saved. Check your browser storage settings and try again.";
      message.className = "form-message form-error";
      return;
    }
    savedProfile = profile;
    message.textContent = "Your details have been saved in this browser.";
    message.className = "form-message form-success";
    setEditing(false);
  });
})();
