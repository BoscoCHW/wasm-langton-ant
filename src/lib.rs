mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u32)]
pub enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
}

#[repr(C)]
pub struct Ant {
    x: u32,
    y: u32,
    direction: Direction,
}

impl Ant {
    fn new(x: u32, y: u32) -> Self {
        Self {
            x,
            y,
            direction: Direction::Up,
        }
    }

    fn rotate_right(&mut self) {
        self.direction = match self.direction {
            Direction::Up => Direction::Right,
            Direction::Right => Direction::Down,
            Direction::Down => Direction::Left,
            Direction::Left => Direction::Up,
        }
    }

    fn rotate_left(&mut self) {
        self.direction = match self.direction {
            Direction::Up => Direction::Left,
            Direction::Right => Direction::Up,
            Direction::Down => Direction::Right,
            Direction::Left => Direction::Down,
        }
    }

    fn move_forward(&mut self) {
        match self.direction {
            Direction::Up => self.x -= 1,
            Direction::Right => self.y += 1,
            Direction::Down => self.x += 1,
            Direction::Left => self.y -= 1,
        }
        
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum Cell {
    White = 0,
    Black = 1,
}

impl Cell {
    fn toggle(&mut self) {
        *self = match *self {
            Cell::White => Cell::Black,
            Cell::Black => Cell::White,
        };
    }
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
    ant: Ant,
}

#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    pub fn tick(&mut self) {
        let ant_idx = self.get_index(self.ant.x, self.ant.y);

        if self.cells[ant_idx] == Cell::White {
            self.ant.rotate_right();
        } else {
            self.ant.rotate_left();
        }
        self.cells[ant_idx].toggle();
        self.ant.move_forward();
    }

    pub fn new() -> Universe {
        let width = 17;
        let height = 17;

        let cells = (0..width * height).map(|_| Cell::White).collect();

        let ant = Ant::new(height / 2, width / 2);

        Universe {
            width,
            height,
            cells,
            ant,
        }
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    pub fn ant(&self) -> *const Ant {
        &self.ant
    }

    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells[idx].toggle();
    }
}

use std::fmt;

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == Cell::White { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}

impl fmt::Display for Direction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{}",
            match *self {
                Direction::Up => "Up",
                Direction::Right => "Right",
                Direction::Down => "Down",
                Direction::Left => "Left",
            }
        )?;
        Ok(())
    }
}
