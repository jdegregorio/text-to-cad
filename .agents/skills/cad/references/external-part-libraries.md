# External Part Libraries

Use external libraries as source-level helpers inside Python generators. Keep
the CAD skill contract unchanged: the owning generator still exposes
`gen_step()` or `gen_dxf()`, returns the expected envelope, and regenerates
explicit targets with the CAD skill tools.

## bd_warehouse

`bd_warehouse` is a build123d parametric part collection. Prefer it when a
prompt asks for standard mechanical components or standard-derived features:

- Fasteners: screws, nuts, washers, heat-set inserts, clearance holes, tap
  holes, threaded holes, insert holes, and captive nut pockets.
- Bearings, pipes, flanges, sprockets, OpenBuilds parts, and modeled threads.
- Simple catalog-style gears when a basic generated gear is enough and no gear
  train layout or meshing analysis is needed.

Example imports:

```python
from bd_warehouse.fastener import ClearanceHole, HexNut, SocketHeadCapScrew
from bd_warehouse.bearing import SingleRowDeepGrooveBallBearing
from bd_warehouse.thread import IsoThread
```

Guidelines:

- Prefer the library's standard sizes and type identifiers over hand-modeled
  approximations.
- Use simplified fasteners for fit and assembly context unless real threads are
  required for the task.
- Let `bd_warehouse` hole helpers create mating cut features when placing
  screws, inserts, or nuts in printed or machined parts.

## py_gearworks

`py_gearworks` is a build123d-based gear geometry generator. Prefer it for
gear-heavy designs where tooth geometry, meshing, alignment, or backlash matter:

- Spur, helical, bevel, cycloid, and inside-ring gears.
- Profile shift, undercut, root/tip fillets, crowning, and gear-pair placement.
- Gear trains, pumps, reducers, and mechanisms where gear centers need to be
  calculated rather than guessed.

Example pattern:

```python
from build123d import Hole
import py_gearworks as pgw

driver = pgw.SpurGear(number_of_teeth=12, module=2, height=5)
driven = pgw.SpurGear(number_of_teeth=24, module=2, height=5)
driver.mesh_to(driven, target_dir=(0, 1, 0), backlash=0.05)

driver_part = driver.build_part()
driver_part = driver_part.cut(driver.center_location_top * Hole(radius=2, depth=5))
```

Guidelines:

- Generate gear bodies with `py_gearworks`, then add bores, hubs, keys, shafts,
  housings, and mounting details with build123d.
- Use `mesh_to()` and the gear location helpers for center distance and
  orientation instead of manually placing meshed gears.
- Pass `mesh_to()` direction inputs as tuples or numpy arrays, not build123d
  `Vector` objects, with the current lockfile version.
- Do not use `py_gearworks` for strength, pitting, thermal, or efficiency
  calculations; validate those separately if the design depends on them.

## Choosing Between Gear Libraries

Use `bd_warehouse.gear` for simple standalone gears that only need a quick
parametric shape. Use `py_gearworks` when the prompt cares about realistic
tooth geometry, ring/bevel/helical/cycloid variants, backlash, or how gears
mesh with one another.
