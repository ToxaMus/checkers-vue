class Board:
    WIDTH = 8
    HEIGHT = 8

    def __init__(self, array: list[list[int]]):
        self.__board = array            

    def get_figure(self, x: int, y: int) -> int:
        return self.__board[x][y]  
    
    def get_all_color_figures(self, colorMove: str) -> list[dict['figure': int, 'x': int, 'y': int]]:
        return [{'figure': self.__board[row][col], 'x': row, 'y': col} for row in range(len(self.__board)) for col in range(len(self.__board[0])) if self.__color_figure_to_bool(colorMove, self.__board[row][col])]
    
    def __color_figure_to_bool(colFig: str, figure: int) -> bool:
        return figure > 0 if colFig == 'WhHITE' else figure < 0

