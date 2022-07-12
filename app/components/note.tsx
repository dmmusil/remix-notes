import { Form } from "@remix-run/react";
import React from "react";
import { FC } from "react";
import { Note } from "~/models/note.server";

type NoteFormProps = {
  isCreate: boolean;
  note?: Note;
  actionData: NoteActionData;
};

export type NoteActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const NoteFormComponent: FC<NoteFormProps> = function ({
  isCreate,
  note,
  actionData,
}) {
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
            defaultValue={note?.title}
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
            defaultValue={note?.body}
          />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <ActionButton text="Save" intent="save" />
        {isCreate ? null : <ActionButton text="Cancel" intent="cancel" />}
      </div>
    </Form>
  );
};

type ActionButtonProps = {
  text: string;
  intent: string;
};

const ActionButton: FC<ActionButtonProps> = function ({ text, intent }) {
  return (
    <button
      type="submit"
      className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      name="intent"
      value={intent}
    >
      {text}
    </button>
  );
};
