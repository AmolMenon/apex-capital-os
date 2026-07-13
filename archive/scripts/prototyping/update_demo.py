import os

path = 'frontend/app/demo-control-center/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    
    insertion = """
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Operations Autopilot Demo</CardTitle>
            </div>
            <CardDescription>
              This shows Apex turning intelligence into execution. Every source conflict, missing data room item, Red Team objection, LP concern, and portfolio risk becomes a task with an owner, priority, workflow stage, and next best action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/operations">
                <Button className="w-full justify-start" variant="outline">
                  <PlayCircle className="mr-2 h-4 w-4" /> Open Operations HQ
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline" onClick={() => fetch('http://127.0.0.1:8000/operations/tasks/generate', { method: 'POST' })}>
                <CheckSquare className="mr-2 h-4 w-4" /> Generate Tasks
              </Button>
              <Link href="/operations/alerts">
                <Button className="w-full justify-start" variant="outline">
                  <ShieldAlert className="mr-2 h-4 w-4" /> Open Alerts
                </Button>
              </Link>
              <Link href="/operations/cadence">
                <Button className="w-full justify-start" variant="outline">
                  <Presentation className="mr-2 h-4 w-4" /> Open Cadence
                </Button>
              </Link>
              <Link href="/operations/approvals">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" /> Open Approvals
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
"""
    if "Operations Autopilot Demo" not in content:
        idx = content.find('</div>\n    </div>\n  )')
        if idx != -1:
            content = content[:idx] + insertion + content[idx:]
            with open(path, 'w') as f:
                f.write(content)
            print("Demo Control Center updated.")
