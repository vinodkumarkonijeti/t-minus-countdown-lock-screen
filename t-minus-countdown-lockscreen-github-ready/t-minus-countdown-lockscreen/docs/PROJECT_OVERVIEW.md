# Project Overview — T-Minus Countdown Lock Screen

## Problem

Important deadlines and personal goals can be easy to overlook when they are buried in calendars, notes, or task applications. Users may benefit from seeing a clear reminder whenever they check their phone.

## Proposed solution

T-Minus Countdown Lock Screen is a lightweight browser-based tool that turns a target date, a goal title, and a set of milestones into a personalized 9:16 lock-screen design. The user edits the goal and milestones, previews the design, and exports a 1080 × 1920 PNG wallpaper.

## Intended users

Students, job seekers, creators, and anyone tracking a personal or professional deadline.

## Main user flow

1. Enter a goal title and target date.
2. Add milestones that break the goal into smaller actions.
3. Choose an accent theme and optionally upload a background photo.
4. Review the live lock-screen preview.
5. Mark milestones complete as progress is made.
6. Download the wallpaper and set it as the phone lock screen.

## Core capabilities

- Real-time clock and date display.
- T-minus / T-plus deadline display.
- Milestone management and completion tracking.
- Progress percentage.
- Theme selection and optional image background.
- PNG export at 1080 × 1920 pixels.
- Browser-local persistence.

## Scope and limitations

The current version is a client-side prototype. It does not provide user accounts, cloud synchronization, notifications, calendar integration, analytics, or a backend. Saved data is local to the browser and device. The exported image is a static wallpaper; its clock and countdown do not continue updating after export.

## Technology and architecture

The application uses semantic HTML for structure, CSS for responsive presentation and themes, and vanilla JavaScript for application behavior. The Canvas API renders the downloadable wallpaper. Local Storage preserves user settings between visits in the same browser.

## Future enhancements

- Optional reminders and calendar export.
- Additional wallpaper layouts and typography.
- Multiple saved goals and wallpaper presets.
- Progressive Web App support.
- Accessibility review and broader device/browser testing.
