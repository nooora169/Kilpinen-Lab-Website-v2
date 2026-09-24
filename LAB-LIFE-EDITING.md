# Editing photos and page content

## Local editing

Stop any running production preview first, then run `npm run dev` and, in a second terminal, `npm run editor`. Open http://localhost:4321/admin/ and choose Open content editor.

The local editor saves into this folder; it does not publish changes. The development server updates as you edit. The production preview from `npm run preview` only changes after `npm run build`.

## Lab life

The main layout is a bordered collage, followed by one small slideshow. All existing gallery records remain; entries without photos stay hidden.

To resize the slideshow, open **Site settings → Page headings and slideshow**. Set **Slideshow maximum width (pixels)** (280–1000, currently 420) and **Slideshow photo height (pixels)** (140–600, currently 220). Width covers the whole card; height covers only its photo area. Captions and controls add to the total height. Photos keep their proportions. On small screens, width shrinks automatically and photo height is capped at 190px.

In Life in the lab, open an entry or create a Photo:
- Upload the photo, then add its caption, alt text and optional photographer credit.
- Give photos the same **Photo group** name to keep them together in a separate collage section. Leave blank for the main collage.
- **Sort order** arranges groups and photos; lower numbers appear earlier. The first visible photo is the large lead tile. Smaller tiles fill available gaps in the grid.
- **Wide photo** spans two columns. **Photo shape: portrait** spans two rows. Use these to mix horizontal and vertical photos.
- **Image framing** selects the complete image or a crop filling the frame. **Crop focus** adjusts a cropped image, for example `50% 25%` to keep faces near the top.
- **Include in featured slideshow** independently selects slideshow photos. Sort order also controls slideshow order.
- Date accepts `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Visitors can filter the collage by year. Leave unknown dates and credits blank.

Eight matching photos appear initially; Show more reveals another eight. All photos are available without JavaScript. Images are served as responsive WebP copies; original uploads are preserved.

The slideshow advances every six seconds. Previous/Next, arrow keys, Home and End navigate; manual navigation or keyboard focus pauses it. Hover temporarily pauses it. Reduced-motion preferences start it paused. With one slide the controls disappear; with no selected photos the slideshow disappears.

## Projects and research photos

Open **Projects** or **Research topics**, choose the relevant entry, then add items under **Images and figures** / **Results images and figures**.

Each item supports an image upload, caption, alt text, credit and **Display size**:
- Small: up to 280px wide, suitable for a logo.
- Medium: up to 640px wide.
- Full available width: fills its figure column.

The original image proportions are preserved, with no scientific-image cropping. You can add, remove and reorder multiple figures. Empty image items stay hidden. Supply only genuine, relevant scientific results.

## People and headings

People supports portraits, role, research summary, full biography and external profile links. Role and summary may be left blank for a new member. Thara currently has only her first name. Former member moves a person to Alumni at the bottom of the page; Pau is listed there.

Site settings → Page headings and slideshow controls these page headings. A newline creates a line break in the Lab life heading. Homepage wording has its existing settings form.

## Editing while the website is live

These forms can be used on a live site once the hosted Decap editor is connected to its GitHub repository and authentication service. An authorised editor can then upload images and change content in `/admin/`; published changes become visible after the site's build/deployment completes. The existing site remains available in the meantime.

Hosted editing is currently disabled in this project. Local editing works independently. No hosting or authentication settings have been changed as part of this review. GitHub updates, hosted-editor setup and deployment remain separate steps for approval.

The editor provides grouping, ordering, sizing and framing controls; it is not a drag-and-drop page builder. Overall layout changes remain in Astro/CSS.

### Placing images beside text

Each project and research-topic image has an **Image placement** menu: **Above the text**, **Left of the text**, **Right of the text**, or **Below the text**. **Automatic** preserves the original arrangement (first project image above, other images below; topic images below). Side images sit beside the project body or topic description, and stack after the text on small screens. Multiple images on the same side stack in their CMS order. Display size remains a maximum, limited by the available column width. The BRAIN-iPSC logo is placed on the right as an example.

Save any open CMS edits before refreshing the editor to load new fields. Local saves appear on the live development site; a production preview needs a fresh build. Hosted edits require the configured publishing workflow and a successful rebuild before appearing on the live site.
