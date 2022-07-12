import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { NoteFormComponent } from "~/components/note";

import { createNote, Note } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  const note = await createNote({ title, body, userId });

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  return <NoteFormComponent actionData={actionData} isCreate={true} />;
}
