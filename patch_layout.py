import re

with open("frontend/app/deals/[id]/layout.tsx", "r") as f:
    content = f.read()

data_room_link = """
            <Link
              href={`/deals/${id}/data-room`}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center ${
                isActive(`/deals/${id}/data-room`)
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:hover:text-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              Data Room
            </Link>
"""

if "href={`/deals/${id}/data-room`}" not in content:
    content = content.replace("href={`/deals/${id}/deal-room`}", "href={`/deals/${id}/data-room`}\n              className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center ${\n                isActive(`/deals/${id}/data-room`)\n                  ? \"border-emerald-500 text-emerald-600 dark:text-emerald-400\"\n                  : \"border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:hover:text-neutral-300 dark:hover:border-neutral-700\"\n              }`}\n            >\n              Data Room\n            </Link>\n            <Link\n              href={`/deals/${id}/deal-room`}")
    with open("frontend/app/deals/[id]/layout.tsx", "w") as f:
        f.write(content)
