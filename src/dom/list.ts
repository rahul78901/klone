const List = <T extends { key: string }>($ul: HTMLElement) => {
  let value: T[] = [];
  return {
    render: (values: T[], cb: (item: HTMLElement, value: T) => void) => {
      if (value.length) {
        const $liList = [...$ul.querySelectorAll("[data-key]")];

        const min = Math.min(value.length, values.length);

        for (let i = 0; i < min; i++) {
          const $li = $liList[i]!;
          if ($li.getAttribute("data-key") !== values[i]?.key) {
            const li = document.createElement("li");
            li.dataset.key = values[i]?.key;

            cb(li, values[i]!);
            $ul.replaceChild(li, $li);
          }
        }

        for (let i = min; i < value.length; i++) {
          const $li = $liList[i]!;
          $li.remove();
        }

        const lenght = values.length;

        for (let i = min; i < lenght; i++) {
          const value = values[i]!;
          const $li = document.createElement("li");
          $li.dataset.key = value.key;
          $ul.append($li);
          cb($li, value);
        }

        value = values;
        return;
      }

      values.map((value) => {
        const $li = document.createElement("li");
        $li.dataset.key = value.key;
        $ul.append($li);
        cb($li, value);
      });

      value = values;
    },
  };
};

export { List };

export default List;
