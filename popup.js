chrome.bookmarks.getSubTree("1").then(([x]) =>
  x.children.reduce(
    (z, x) =>
      z
        .then(() =>
          (x.children ?? [])
            .toSorted(
              (x, y) =>
                new URL(x.url).origin.localeCompare(new URL(y.url).origin) ||
                x.title.localeCompare(y.title)
            )
            .reduce(
              (z, x) =>
                z.then((ys) =>
                  chrome.bookmarks
                    .move(x.id, { parentId: x.parentId })
                    .then((y) => ys.concat(y))
                ),
              Promise.resolve([])
            )
        )
        .then((xs) =>
          Object.values(Object.groupBy(xs, (x) => x.title.split(/\d+/)))
            .flatMap((ys) => ys.slice(0, -1))
            .reduce(
              (z, x) =>
                z
                  .then(() => chrome.bookmarks.remove(x.id))
                  .catch(console.error),
              Promise.resolve()
            )
        ),
    Promise.resolve()
  )
);
