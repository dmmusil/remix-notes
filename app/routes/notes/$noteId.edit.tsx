import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { NoteActionData, NoteFormComponent } from "~/components/note";

import { editNote, Note } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  note: Note;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const formData = await request.formData();
  const actionType = formData.get("intent");
  if (actionType === "cancel") return redirect(`/notes/${params.noteId}`);

  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<NoteActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<NoteActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  await editNote({ id: params.noteId, title, body, userId });

  return redirect(`/notes/${params.noteId}`);
};

export default function NoteEditPage() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as NoteActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <NoteFormComponent
      isCreate={false}
      actionData={actionData}
      note={data.note}
    />
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
