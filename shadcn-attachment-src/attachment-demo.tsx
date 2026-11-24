import { FileCodeIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "./attachment"
import { Spinner } from "./spinner"

const images = [
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    src: "./assets/workspace.jpg",
    alt: "Workspace",
  },
  {
    name: "desk-reference.jpg",
    meta: "JPG · 1.1 MB",
    src: "./assets/desk-reference.jpg",
    alt: "Desk",
  },
  {
    name: "office-reference.jpg",
    meta: "JPG · 940 KB",
    src: "./assets/office-reference.jpg",
    alt: "Office",
  },
]

export function AttachmentDemo() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 py-12">
      <AttachmentGroup>
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction disabled aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction disabled aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}
